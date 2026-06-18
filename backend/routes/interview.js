const express = require("express");
const { reply } = require("../services/interviewer");
const { score } = require("../services/scorer");
const { sessions } = require("../storage/sessions");

const router = express.Router();

router.post("/interview", (req, res) => {
  const { message } = req.body;

  const ai = reply(message);
  const rating = score(message);

  sessions.push({
    message,
    score: rating
  });

  res.json({
    question: ai.answer,
    score: rating
  });
});

module.exports = router;