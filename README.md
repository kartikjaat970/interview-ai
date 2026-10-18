# InterviewAI

InterviewAI is a full-stack, modular technical interview preparation platform designed to help software engineers practice behavioral and mock coding questions.

> **Current Status Note:** The interviewer is powered by Google Gemini (`gemini-2.5-flash` by default) and keeps per-session conversation history in memory. Answer scoring is still a simple rule-based heuristic (see `scorer.js`).

---

## Getting Started

**Requirements:** Node.js 20+ and a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
# 1. Backend (http://localhost:8000)
cd backend
npm install
cp .env.example .env      # then put your key in GEMINI_API_KEY
npm start

# 2. Frontend (http://localhost:3000) - in a second terminal
cd frontend
npm install
npm start
```

If the backend can't reach Gemini (for example a missing or invalid key), the chat shows the error instead of a fake interviewer reply.

---

## Current Project Architecture

The repository uses a cleanly separated monorepo architecture split down into distinct backend and frontend directories:

```text
interview-ai/
├── backend/            # Express.js REST API server & state layers
│   ├── routes/         # HTTP request endpoints
│   ├── services/       # Mock question shufflers & text evaluators
│   ├── storage/        # Volatile RAM session memory arrays
│   └── websocket/      # Real-time network sync channels
└── frontend/           # React single-page UI application
    └── src/
        └── components/ # Interface layouts (Chat, Input, Metrics)
```

---

##  File-by-File Functional Breakdown

###  Backend Layer (`/backend`)

*   **`server.js`**  
    The main engine file. Instantiates the Express application, configures CORS/JSON handling middlewares, binds the router modules, and initializes the HTTP/WebSocket server ports.
*   **`routes/interview.js`**  
    Acts as the entry router controller for the core endpoint (`POST /interview`). It accepts user answer text payloads, triggers downstream scoring modules, tracks sessions, and returns JSON packages.
*   **`services/interviewer.js`**  
    Calls the Gemini API with a senior-interviewer system prompt and the session's chat history, so each follow-up question builds on earlier answers. The API key is read from `GEMINI_API_KEY` (via `backend/.env`). It throws on failure so callers can report the error, and history is capped to the most recent 40 messages.
*   **`services/scorer.js`**  
    Runs a deterministic string calculation function. It starts at 50 and adds points for answers longer than 100 characters and for the keywords "example" and "team" (case-insensitive), for a maximum of 90.
*   **`storage/sessions.js`**  
    Acts as a lightweight, volatile in-memory database simulation using local JavaScript arrays. It exposes basic CRUD utility functions (`create`, `list`, `find`, `remove`) to record user history during execution runtime.
*   **`websocket/socket.js`**  
    Sets up an open Socket.io server connection pipeline that logs incoming real-time handshakes and echoes back connection status receipts to network channels.

###  Frontend UI Layer (`/frontend`)

*   **`package.json`**  
    Declares project definitions, compilation behaviors, and client-side dependencies (`react`, `axios`, and `socket.io-client`).
*   **`src/App.jsx`**  
    The primary rendering node of the frontend application. It loads base fonts, styles, layouts, and mounts the inner `Chat` components.
*   **`src/api.js`**  
    Configures and exports an Axios instance pre-configured to handle cross-origin network queries pointing back to the server port (`localhost:8000`).
*   **`src/socket.js`**  
    Instantiates the WebSocket client layer, setting it up to map streams back to the active backend instance.
*   **`src/index.css`**  
    The application's global style sheets, mapping color tokens, text positioning scales, margins, animations, and container grids.
*   **`src/components/Chat.jsx`**  
    Manages client state for the application. It aggregates text logs, hooks securely into input actions, submits messages across async boundaries via Axios, and appends unique data packages safely to prevent rendering race conditions.
*   **`src/components/Input.jsx`**  
    A controlled form field capturing user answers. It clears user keystrokes upon submission and hooks into `Enter` key keydowns for smoother user experience.
*   **`src/components/Message.jsx`**  
    A pure presentation UI block designed to distinguish speech bubbles between the candidate and the AI interviewer using clear accent borders.
*   **`src/components/Score.jsx`**  
    An interface panel that displays the current score returned by the backend.