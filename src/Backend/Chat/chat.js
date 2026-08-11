import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

const SYSTEM_INSTRUCTION =
    'You are the NexusBuild Support Agent, a helpful assistant for the NexusBuild ' +
    'platform website. Answer questions using only the information retrieved from the ' +
    'site content provided to you. If the answer isn\'t in the retrieved content, say ' +
    'you don\'t have that information and suggest the user contact the team directly — ' +
    'never make up project details, dates, or figures. Keep answers concise (2-4 sentences) ' +
    'and match the site\'s professional tone.';

// POST /api/chat
router.post('/', async (req, res) => {
    const message = req.body?.message;


    if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'message is required and must be a non-empty string' });
    }

    const fileSearchStoreName = process.env.GEMINI_FILE_SEARCH_STORE;
    if (!fileSearchStoreName) {
        return res.status(500).json({ error: 'GEMINI_FILE_SEARCH_STORE environment variable is not set' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: message,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [
                    {
                        fileSearch: {
                            fileSearchStoreNames: [fileSearchStoreName],
                        },
                    },
                ],
            },
        });

        return res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error('[Chat API] Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
