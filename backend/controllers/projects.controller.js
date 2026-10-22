import { supabase } from '../config/supabase.js';

/**
 * Get all projects
 * GET /api/projects
 */
export const getAllProjects = async (req, res, _next) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json({ projects: data || [] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Get project by ID
 * GET /api/projects/:id
 */
export const getProjectById = async (req, res, _next) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Project not found' });
        }

        return res.status(200).json({ project: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new project (Admin Only)
 * POST /api/projects
 */
export const createProject = async (req, res, _next) => {
    const { id, name, total_units, progress_phase, phases } = req.body;

    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    id,
                    name,
                    total_units: total_units || 0,
                    progress_phase: progress_phase || 1,
                    phases: phases || null,
                },
            ])
            .select();

        if (error) throw error;

        return res.status(201).json({
            message: 'Project created successfully',
            project: data?.[0],
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
