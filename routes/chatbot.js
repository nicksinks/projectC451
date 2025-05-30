require('dotenv').config();
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;

const SYSTEM_MESSAGE = {
  role: "system",
  content: `
    You are ZeigBot, a helpful assistant for Nicholas Zeig.
    - Focus on helping with work tasks (e.g., writing, summarizing, researching, and planning).
    - Be brief and professional.
    - Never provide personal opinions unless asked.
    - If a task is unclear, ask for clarification.
    - Don't respond to questions outside productivity, tech, or business analysis unless told otherwise.
  `
};


let openai;
if (apiKey) {
  openai = new OpenAI({ apiKey });
}

router.post('/', async (req, res) => {
  const userMessage = req.body.message;

  if (!openai) {
    return res.json({ reply: "Chat assistant is not set up yet. Please add your API key." });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        SYSTEM_MESSAGE,
        { role: 'user', content: userMessage }
      ]
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ reply: 'Something went wrong with the chatbot.' });
  }
});

module.exports = router;


