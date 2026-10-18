const { Server } = require("socket.io");
const { reply } = require("../services/interviewer");
const { score } = require("../services/scorer");

function connect(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected via WebSocket:", socket.id);

    // Listens for real-time candidate responses
    socket.on("message", async (data) => {
      const text = data && typeof data.text === "string" ? data.text : "";
      // Fall back to the socket ID as a unique session identifier
      const sessionId =
        data && typeof data.sessionId === "string" && data.sessionId
          ? data.sessionId
          : socket.id;

      if (!text.trim()) return;

      try {
        const ai = await reply(sessionId, text);
        const rating = score(text);

        socket.emit("response", {
          text: ai.answer,
          score: rating,
        });
      } catch (error) {
        console.error("WebSocket interview request failed:", error);
        socket.emit("error_message", {
          error: "The AI interviewer is unavailable right now.",
        });
      }
    });
  });
}

module.exports = {
  connect,
};
