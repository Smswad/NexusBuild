/**
 * Resolve GIS Google Maps Shortlink Redirect
 * GET /api/resolve-map?url=...
 */
export const resolveMap = async (req, res, _next) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'url parameter is required' });
    }

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual',
        });
        const resolvedUrl = response.headers.get('location') || url;
        return res.status(200).json({ resolvedUrl });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
