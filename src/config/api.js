/**
 * Centralized API URL resolver
 * Prepends VITE_API_URL if configured, otherwise falls back to relative /api path
 */
export const getApiUrl = (endpoint = '') => {
    const rawBase = import.meta.env?.VITE_API_URL || '';
    const baseUrl = String(rawBase).trim().replace(/\/+$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return baseUrl ? `${baseUrl}${path}` : path;
};

export default getApiUrl;
