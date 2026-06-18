const { Server } = require("socket.io");

function connect(server) {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("connected");

    socket.on("message", (data) => {
      socket.emit("response", {
        text: "AI received"
      });
    });
  });
}

module.exports = {
  connect
};