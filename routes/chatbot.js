require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;

let openai;
if (apiKey) {
  const configuration = new Configuration({ apiKey });
  openai = new OpenAIApi(configuration);
}

router.post('/', async (req, res) => {
  const userMessage = req.body.message;

  if (!openai) {
    return res.json({ reply: "Chat assistant is not set up yet. Please add your API key." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: userMessage }]
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ reply: 'Something went wrong with the chatbot.' });
  }
});

module.exports = router;

