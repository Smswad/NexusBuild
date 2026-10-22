import { supabase } from '../config/supabase.js';

/**
 * Submit a customer inquiry / lead
 * POST /api/leads or POST /api/inquiries
 */
export const createLead = async (req, res, _next) => {
    const {
        name,
        fullName,
        phone,
        phoneNumber,
        email,
        subject,
        message,
        interest,
        source,
        status,
        date,
    } = req.body;

    const leadName = name || fullName;
    const leadPhone = phone || phoneNumber || email || 'N/A';
    const leadInterest = interest || (subject ? `${subject}: ${message}` : message);
    const leadSource = source || 'Website Contact Form';
    const leadStatus = status || 'New';
    const leadDate = date || new Date().toISOString();

    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    name: leadName,
                    phone: leadPhone,
                    interest: leadInterest,
                    source: leadSource,
                    status: leadStatus,
                    date: leadDate,
                },
            ])
            .select();

        if (error) throw error;

        return res.status(201).json({
            message: 'Inquiry submitted successfully',
            lead: data?.[0] || {
                name: leadName,
                phone: leadPhone,
                interest: leadInterest,
                source: leadSource,
                status: leadStatus,
                date: leadDate,
            },
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Get all submitted leads/inquiries (Admin / Staff)
 * GET /api/leads
 */
export const getLeads = async (req, res, _next) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json({ leads: data || [] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
