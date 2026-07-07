const express = require("express");
const { reply } = require("../services/interviewer");
const { score } = require("../services/scorer");
const sessionsStorage = require("../storage/sessions");

const router = express.Router();

router.post("/interview", (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = reply(message);
  const rating = score(message);

  sessionsStorage.create({
    message,
    score: rating
  });

  res.json({
    question: ai.answer,
    score: rating
  });
});

module.exports = router;