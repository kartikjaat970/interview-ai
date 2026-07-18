const express = require("express");
const { reply } = require("../services/interviewer");
const { score } = require("../services/scorer");

const router = express.Router();

router.post("/interview", async (req, res) => {
  const { message, sessionId = "default-session" } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const ai = await reply(sessionId, message);
    const rating = score(message);

    res.json({
      question: ai.answer,
      score: rating
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;