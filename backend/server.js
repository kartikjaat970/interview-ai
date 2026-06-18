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

server.listen(8000, () => {
  console.log("server started");
});