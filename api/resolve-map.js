export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'url parameter is required' });
    }

    try {
        // Fetch URL headers to follow redirect
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual'
        });

        const resolvedUrl = response.headers.get('location') || url;
        return res.status(200).json({ resolvedUrl });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
