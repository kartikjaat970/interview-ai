// Load backend/.env (GEMINI_API_KEY etc.) before anything reads process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const route = require("./routes/interview");
const { connect } = require("./websocket/socket");

const app = express();

app.use(cors());
app.use(express.json());
app.use(route);

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

const server = http.createServer(app);

connect(server);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.warn(
      "Warning: GEMINI_API_KEY is not set. Interview requests will fail until you add it to backend/.env."
    );
  }
});
