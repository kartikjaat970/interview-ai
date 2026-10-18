const express = require("express");
const { reply } = require("../services/interviewer");
const { score } = require("../services/scorer");

const router = express.Router();

const MAX_MESSAGE_LENGTH = 4000;

router.post("/interview", async (req, res) => {
  const { message, sessionId = "default-session" } = req.body || {};

  // Validate the type first: calling .trim() on a non-string used to throw
  // outside the try/catch, which left the request hanging.
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res
      .status(413)
      .json({ error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
  }

  try {
    const ai = await reply(String(sessionId), message);
    const rating = score(message);

    res.json({
      question: ai.answer,
      score: rating,
    });
  } catch (error) {
    console.error("Interview request failed:", error);
    res.status(502).json({ error: "The AI interviewer is unavailable right now." });
  }
});

module.exports = router;
