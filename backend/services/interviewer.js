const { GoogleGenAI } = require("@google/genai");
const sessionsStorage = require("../storage/sessions");

// Initializes the SDK. It automatically reads process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

const SYSTEM_INSTRUCTION = `
You are a senior software engineering interviewer. 
Your goal is to conduct a technical interview.
Ask one clear, relevant question at a time based on the user's background or previous answer.
Keep your responses conversational, realistic, and strictly professional.
`;

/**
 * Generate a dynamic AI response using chat history memory
 * @param {string} sessionId 
 * @param {string} message 
 * @returns {Promise<{ answer: string }>}
 */
async function reply(sessionId, message) {
  try {
    // Fetch existing session data or initialize a clean history
    let session = sessionsStorage.find(s => s.id === sessionId);
    if (!session) {
      session = sessionsStorage.create({ id: sessionId, history: [] });
    }

    // Format history into the required structure for the Gemini Chat API
    const contents = session.history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Append the current candidate message to the chat layout
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Request response generation
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const aiAnswer = response.text || "I'm sorry, I couldn't process that response.";

    // Save the conversation exchange history for the next turn
    session.history.push({ role: "user", text: message });
    session.history.push({ role: "model", text: aiAnswer });

    return { answer: aiAnswer };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { answer: "Sorry, I am having trouble connecting to my brain right now." };
  }
}

module.exports = { reply };