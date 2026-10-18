const { GoogleGenAI } = require("@google/genai");
const sessionsStorage = require("../storage/sessions");

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Keep only the most recent turns so long interviews don't grow without bound.
const MAX_HISTORY_MESSAGES = 40;

const SYSTEM_INSTRUCTION = `
You are a senior software engineering interviewer.
Your goal is to conduct a technical interview.
Ask one clear, relevant question at a time based on the user's background or previous answer.
Keep your responses conversational, realistic, and strictly professional.
`;

let client = null;

// Created lazily so the server can still start (and report a clear error)
// when no API key is configured, instead of crashing at require() time.
// The key is passed explicitly: the SDK only auto-reads GOOGLE_API_KEY, not
// GEMINI_API_KEY.
function getClient() {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set GEMINI_API_KEY in backend/.env (see .env.example)."
    );
  }

  client = new GoogleGenAI({ apiKey });
  return client;
}

/**
 * Generate a dynamic AI response using chat history memory.
 * Throws on failure so callers can report the error instead of showing a
 * fake "AI" message.
 * @param {string} sessionId
 * @param {string} message
 * @returns {Promise<{ answer: string }>}
 */
async function reply(sessionId, message) {
  const ai = getClient();

  // Fetch existing session data or initialize a clean history
  let session = sessionsStorage.find((s) => s.id === sessionId);
  if (!session) {
    session = sessionsStorage.create({ id: sessionId, history: [] });
  }

  // Format history into the structure the Gemini API expects
  const contents = session.history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  // Append the current candidate message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  const aiAnswer =
    (response.text && response.text.trim()) ||
    "I'm sorry, I couldn't process that response. Could you rephrase?";

  // Only save the exchange once the model has actually answered
  session.history.push({ role: "user", text: message });
  session.history.push({ role: "model", text: aiAnswer });

  if (session.history.length > MAX_HISTORY_MESSAGES) {
    // Drop in pairs so history always starts with a "user" turn
    session.history.splice(0, session.history.length - MAX_HISTORY_MESSAGES);
  }

  return { answer: aiAnswer };
}

module.exports = { reply };
