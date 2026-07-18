const { Server } = require("socket.io");
const { reply } = require("../services/interviewer");
const { score } = require("../services/scorer");

function connect(server) {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected via WebSocket:", socket.id);

    // Listens for real-time candidate responses
    socket.on("message", async (data) => {
      const text = data.text || "";
      const sessionId = data.sessionId || socket.id; // Falls back to socket ID as unique session identifier

      if (!text.trim()) return;

      // Await live model generation
      const ai = await reply(sessionId, text);
      const rating = score(text);

      // Emits actual generated content back to your React app
      socket.emit("response", {
        text: ai.answer,
        score: rating
      });
    });
  });
}

module.exports = {
  connect
};