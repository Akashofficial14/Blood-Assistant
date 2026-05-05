const { GoogleGenAI } = require('@google/genai');
const { searchKnowledgeBase } = require('../utills/ragSearch');
require('dotenv').config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatController = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Step 1: RAG — Search knowledge base
    const relevantDocs = searchKnowledgeBase(message);

    // Step 2: Build context from retrieved docs
    let context = '';
    if (relevantDocs.length > 0) {
      context = relevantDocs.map(doc => doc.content).join('\n\n');
    }

    // Step 3: Build system prompt
    const systemPrompt = `You are Blood Assistant, a helpful chatbot for the Blood Assistant website — a platform that connects blood donors, recipients, and blood banks across India.

${context ? `Use ONLY the following information to answer the user's question:\n\n${context}` : 'The user asked something not covered in the website data.'}

RULES:
- Only answer based on the website information provided above.
- If the question is not related to blood donation, blood requests, or the Blood Assistant platform, politely say: "I can only help with Blood Assistant related questions. Please ask about blood donation, requests, or our platform."
- Keep answers clear, helpful, and friendly.
- If context is provided, use it directly. Do not make up information.
- Format steps with numbers when explaining processes.`;

    // Step 4: Build messages (same logic)
    const messages = [
      ...conversationHistory.slice(-6),
      { role: 'user', content: message }
    ];

    // Convert messages to Gemini format
    const chatHistoryText = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const finalPrompt = `${systemPrompt}\n\n${chatHistoryText}\nAssistant:`;

    // Step 5: Call Gemini API
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    const reply = response.text;

    res.json({
      reply,
      retrieved: relevantDocs.length > 0 ? relevantDocs.map(d => d.topic) : []
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

module.exports = { chatController };