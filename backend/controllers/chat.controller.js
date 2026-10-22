import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

const SYSTEM_INSTRUCTION =
    'You are the NexusBuild Support Agent, a helpful assistant for the NexusBuild ' +
    'platform website. Answer questions using only the information retrieved from the ' +
    'site content provided to you. If the answer isn\'t in the retrieved content, say ' +
    'you don\'t have that information and suggest the user contact the team directly — ' +
    'never make up project details, dates, or figures. Keep answers concise (2-4 sentences) ' +
    'and match the site\'s professional tone.';

const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash'];

/**
 * Handle AI support chatbot message
 * POST /api/chat
 */
export const handleChat = async (req, res, _next) => {
    const { message } = req.body;

    const fileSearchStoreName = env.GEMINI_FILE_SEARCH_STORE || process.env.GEMINI_FILE_SEARCH_STORE;
    if (!fileSearchStoreName) {
        return res.status(500).json({ error: 'GEMINI_FILE_SEARCH_STORE environment variable is not set' });
    }

    try {
        const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        let replyText = null;
        let lastError = null;

        for (const model of MODELS) {
            try {
                const response = await ai.models.generateContent({
                    model,
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
                if (response?.text) {
                    replyText = response.text;
                    break;
                }
            } catch (err) {
                console.warn(`[Chat API] Model ${model} failed (${err.message}). Trying fallback model...`);
                lastError = err;
            }
        }

        if (!replyText) {
            throw lastError || new Error('All AI models failed to respond.');
        }

        return res.status(200).json({ reply: replyText });
    } catch (error) {
        console.error('[Chat API] Fatal Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
};
