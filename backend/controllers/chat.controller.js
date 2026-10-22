import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';

// Fallback public projects catalog when database table is empty or offline
const FALLBACK_PUBLIC_PROJECTS = [
    {
        id: 'p1',
        name: 'Sardar Tower – Block A',
        status: 'AVAILABLE',
        location: 'Narayanganj',
        type: 'Mixed Use',
        price: 'Starting from ৳1.50Cr (৳1.50 Cr – ৳3.80 Cr)',
        area: '1,400 - 2,800 sq. ft (28 Floors)',
        description: 'A flagship mixed-use high-rise featuring luxury apartments, modern commercial office suites, and state-of-the-art seismic-grade structural foundation.',
        nearby_hospitals: 'Narayanganj 200 Bed Hospital (0.8 km), Popular Diagnostic Center (1.2 km)',
        nearby_schools: 'Ideal School & College (0.6 km), Narayanganj Govt High School (1.1 km)',
        nearby_markets: 'Shamabay New Market (0.3 km), Balur Math Market (0.7 km)',
    },
    {
        id: 'p2',
        name: 'Green Valley Residency',
        status: 'READY TO MOVE',
        location: 'BB Road, Narayanganj',
        type: 'Residential',
        price: 'Starting from ৳1.10Cr (৳1.10 Cr – ৳2.60 Cr)',
        area: '1,200 - 2,200 sq. ft (16 Floors)',
        description: 'Eco-friendly luxury residential gated community featuring lush green balconies, solar power integration, and riverfront peaceful surroundings.',
        nearby_hospitals: 'Labaid Specialized Hospital (0.5 km), Square Hospital (1.4 km)',
        nearby_schools: 'Scholastica School (0.8 km), Mastermind School (1.2 km)',
        nearby_markets: 'Shimanto Square (0.6 km), Rapa Plaza (1.1 km)',
    },
];

const MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.8-flash',
];

/**
 * Extract simple search filters and keywords from user message
 * (Location, Property Type, Budget / Price range, Project Name)
 */
export const extractFilters = (message = '') => {
    const text = String(message).toLowerCase();
    const filters = {};

    // 1. Location keywords
    if (/narayanganj/i.test(text)) {
        filters.location = 'Narayanganj';
    } else if (/bb\s*road|b\.b\.\s*road/i.test(text)) {
        filters.location = 'BB Road';
    } else if (/chashara|chasara/i.test(text)) {
        filters.location = 'Chashara';
    } else if (/dhaka/i.test(text)) {
        filters.location = 'Dhaka';
    }

    // 2. Property Type keywords
    if (/mixed\s*use/i.test(text)) {
        filters.type = 'Mixed Use';
    } else if (/residential|apartment|flat|home|living/i.test(text)) {
        filters.type = 'Residential';
    } else if (/commercial|office|retail|shop/i.test(text)) {
        filters.type = 'Commercial';
    }

    // 3. Status keywords
    if (/ready\s*to\s*move|ready/i.test(text)) {
        filters.status = 'READY TO MOVE';
    } else if (/available/i.test(text)) {
        filters.status = 'AVAILABLE';
    }

    // 4. Project Name keywords
    if (/sardar(\s*tower)?/i.test(text)) {
        filters.name = 'Sardar Tower';
    } else if (/green\s*valley/i.test(text)) {
        filters.name = 'Green Valley';
    } else if (/heritage(\s*plaza)?/i.test(text)) {
        filters.name = 'Heritage Plaza';
    }

    // 5. Price / Budget keywords
    if (/cheap|affordable|budget|low(er)?\s*price/i.test(text)) {
        filters.budget = 'affordable';
    } else if (/luxury|premium|high(er)?\s*price/i.test(text)) {
        filters.budget = 'luxury';
    }

    return filters;
};

/**
 * Query live public projects from Supabase with safety guarantees:
 * - Reads ONLY public project fields (id, name, status, location, type, price, area, description, nearby facilities)
 * - NEVER accesses clients, leads, applications, installments, or transactions
 * - Limits result set to 5 rows
 */
export const fetchLivePublicProjects = async (filters = {}) => {
    try {
        let query = supabase
            .from('public_projects')
            .select('id, name, status, location, type, price, area, description, nearby_hospitals, nearby_schools, nearby_markets');

        if (filters.name) {
            query = query.ilike('name', `%${filters.name}%`);
        }
        if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.type) {
            query = query.ilike('type', `%${filters.type}%`);
        }
        if (filters.status) {
            query = query.ilike('status', `%${filters.status}%`);
        }

        const { data, error } = await query.limit(5);

        if (!error && Array.isArray(data) && data.length > 0) {
            return data;
        }

        // Fallback: If filtered query yielded 0 rows, fetch the top 5 general public projects
        const fallbackRes = await supabase
            .from('public_projects')
            .select('id, name, status, location, type, price, area, description, nearby_hospitals, nearby_schools, nearby_markets')
            .limit(5);

        if (!fallbackRes.error && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
            return fallbackRes.data;
        }
    } catch (dbErr) {
        console.warn('[Chat Controller] Live Supabase query error, using public fallback:', dbErr.message);
    }

    // Safe in-memory public projects fallback if Supabase table is empty or offline
    return FALLBACK_PUBLIC_PROJECTS.slice(0, 5);
};

/**
 * Helper to guarantee that every reply begins with "Assalamu Alaikum"
 */
export const enforceIslamicGreeting = (text = '') => {
    const trimmed = String(text || '').trim();
    if (!trimmed) {
        return 'Assalamu Alaikum! How can I assist you with NexusBuild developments today?';
    }

    // Check if reply already begins with Assalamu Alaikum / Assalamualikum / As-salamu alaykum
    const greetingRegex = /^(assalamu\s*['’]?\s*alaikum|assalamualikum|assalamu\s*al\s*aikum|as-salamu\s*alaykum)/i;
    if (greetingRegex.test(trimmed)) {
        return trimmed;
    }

    return `Assalamu Alaikum! ${trimmed}`;
};

/**
 * Handle AI support chatbot message
 * POST /api/chat
 */
export const handleChat = async (req, res, _next) => {
    const { message } = req.body;

    // 1. Extract search filters & keywords from user query
    const filters = extractFilters(message);

    // 2. Query live Supabase public projects table (Strictly public fields, limit 5)
    const projects = await fetchLivePublicProjects(filters);

    // 3. Assemble live catalog context
    const contextLines = projects.map((p, idx) => `
Project #${idx + 1}: ${p.name}
- Status: ${p.status || 'AVAILABLE'}
- Location: ${p.location || 'Narayanganj'}
- Property Type: ${p.type || 'Mixed Use'}
- Pricing: ${p.price || 'Contact for price'}
- Land & Unit Size: ${p.area || 'N/A'}
- Description: ${p.description || 'N/A'}
- Nearby Hospitals: ${p.nearby_hospitals || 'N/A'}
- Nearby Schools: ${p.nearby_schools || 'N/A'}
- Nearby Markets: ${p.nearby_markets || 'N/A'}
`.trim());

    const catalogContext = contextLines.join('\n\n---\n\n');

    const systemInstruction = `You are the NexusBuild AI Support Agent, assisting visitors on the official website.
You answer user questions using the official NexusBuild Platform Overview and the Live Public Projects Data below.

MANDATORY GREETING RULE:
Every response from you MUST begin with the greeting "Assalamu Alaikum!" (or "Assalamu Alaikum,"). Never omit this greeting under any circumstances, regardless of the user's prompt or tone.

Platform Overview:
NexusBuild is a premier real estate and infrastructure management platform delivering modern residential, commercial, and mixed-use architectural developments with Grade-A seismic engineering and interactive GIS mapping.

Live Public Projects Data:
${catalogContext}

STRICT GROUNDING INSTRUCTIONS:
1. Answer only using the verified facts, pricing, locations, and specifications present in the context above.
2. If the user asks about a property, location, price, date, person, policy, or detail that is NOT clearly present in the context above, you MUST say "I don't know" (or "I don't know based on the current public catalog; please contact our sales office directly for more details").
3. NEVER guess, speculate, or fabricate project details, prices, or handover dates.
4. Keep answers concise (2 to 4 sentences), professional, and accurate.`;

    // 4. Invoke Google Gemini LLM using backend .env key only
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // Safe offline response grounded in live Supabase data
        const matched = projects.map(p => `• ${p.name} (${p.type} in ${p.location}, ${p.price})`).join('\n');
        return res.status(200).json({
            reply: enforceIslamicGreeting(`Here are the current developments in our live catalog:\n${matched}\n\nFor any details not listed here, I don't know and recommend contacting our office.`),
        });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        let replyText = null;
        let lastError = null;

        for (const model of MODELS) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: message,
                    config: {
                        systemInstruction,
                        temperature: 0.2, // Low temperature for high factual adherence
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

        return res.status(200).json({ reply: enforceIslamicGreeting(replyText) });
    } catch (error) {
        console.error('[Chat API] Fatal Error:', error.message);
        // Fallback grounded answer so the user interface never breaks
        return res.status(200).json({
            reply: enforceIslamicGreeting(`NexusBuild currently offers ${projects.map(p => p.name).join(' and ')} in Narayanganj. For any other information, I don't know based on the current live catalog; please contact our team directly.`),
        });
    }
};

export default handleChat;
