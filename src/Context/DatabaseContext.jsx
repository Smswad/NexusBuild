import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PROJECTS } from '../data/projectsData';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [leads, setLeads] = useState([]);
    const [applications, setApplications] = useState([]);
    const [projects, setProjects] = useState([]);
    const [properties, setProperties] = useState([]);
    const [installments, setInstallments] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [siteUpdates, setSiteUpdates] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [projectPhotos, setProjectPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock public projects (use static PROJECTS list as default fallback)
    const [publicProjects, setPublicProjects] = useState(PROJECTS);

    // Fetch everything on mount
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [
                    resClients, resLeads, resApps, resProjects,
                    resProps, resInsts, resTrans, resUpdates, resTickets, resPublicProjects, resPhotos
                ] = await Promise.all([
                    supabase.from('clients').select('*'),
                    supabase.from('leads').select('*'),
                    supabase.from('applications').select('*'),
                    supabase.from('projects').select('*'),
                    supabase.from('properties').select('*'),
                    supabase.from('installments').select('*'),
                    supabase.from('transactions').select('*'),
                    supabase.from('site_updates').select('*'),
                    supabase.from('tickets').select('*'),
                    supabase.from('public_projects').select('*'),
                    supabase.from('project_photos').select('*')
                ]);

                if (resPhotos.data && resPhotos.data.length > 0) {
                    setProjectPhotos(resPhotos.data.map(p => ({
                        id: p.id,
                        projectId: p.project_id,
                        url: p.url,
                        caption: p.caption,
                        date: p.date
                    })));
                } else {
                    try {
                        const local = JSON.parse(localStorage.getItem('all_project_photos') || '[]');
                        if (local.length > 0) setProjectPhotos(local);
                    } catch(e) {}
                }

                if (resClients.data) setClients(resClients.data);
                setLeads([]);
                if (resApps.data) {
                    setApplications(resApps.data.map(app => {
                        try {
                            if (app.unit && app.unit.startsWith('{')) {
                                const parsed = JSON.parse(app.unit);
                                return {
                                    ...app,
                                    email: parsed.email,
                                    phone: parsed.phone,
                                    unit: parsed.unit || 'Not specified'
                                };
                            }
                        } catch(e) {}
                        return app;
                    }));
                }
                const defaultProjectsList = PROJECTS.map(p => ({
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    location: p.location || 'Narayanganj',
                    image: p.image || '/Frontend/Projects/Reliance_Zenith_Towers.svg',
                    area: '1,850 sq. ft',
                    handoverDate: 'Dec 2026',
                    totalUnits: p.totalUnits || 32,
                    progressPhase: 3
                }));

                const rawProjects = (resProjects.data && resProjects.data.length > 0) ? resProjects.data : defaultProjectsList;

                setProjects(rawProjects.map(p => {
                    const catalogMatch = PROJECTS.find(c => c.id === p.id || c.slug === p.slug) || {};
                    let localMilestones = null;
                    let savedPhase = null;
                    try {
                        const stored = localStorage.getItem(`project_milestones_${p.id}`);
                        if (stored) localMilestones = JSON.parse(stored);
                        const phaseStored = localStorage.getItem(`project_phase_${p.id}`);
                        if (phaseStored) savedPhase = parseInt(phaseStored);
                    } catch(e) {}

                    const defaultPhases = [
                        { id: 1, name: 'Piling & Foundation', date: 'Completed Dec 23', progress: 100 },
                        { id: 2, name: 'Structural Basement & Columns', date: 'Completed Feb 24', progress: 100 },
                        { id: 3, name: 'Slabs Casting & Brickwork', date: 'Target: May 26', progress: 85 },
                        { id: 4, name: 'Finishing & Handover', date: 'Target: Dec 26', progress: 0 },
                    ];

                    const activePhases = localMilestones || p.phases || defaultPhases;
                    const incomplete = activePhases.find(ph => ph.progress < 100);
                    const derivedPhase = incomplete ? incomplete.id : activePhases.length;
                    const finalPhase = (savedPhase !== null && savedPhase <= activePhases.length) ? savedPhase : derivedPhase;

                    return { 
                        ...catalogMatch,
                        ...p, 
                        name: p.name || catalogMatch.name || 'Sardar Tower – Block A',
                        location: p.location || catalogMatch.location || 'Narayanganj',
                        image: p.image || catalogMatch.image || '/Frontend/Projects/Reliance_Zenith_Towers.svg',
                        area: p.area || catalogMatch.area || '1,850 sq. ft',
                        handoverDate: p.handoverDate || p.handover_date || catalogMatch.handoverDate || 'Dec 2026',
                        progressPhase: finalPhase, 
                        progress_phase: finalPhase, 
                        totalUnits: p.total_units || p.totalUnits || catalogMatch.totalUnits || 32,
                        phases: activePhases
                    };
                }));
                if (resProps.data) setProperties(resProps.data.map(p => ({ ...p, clientId: p.client_id, projectId: p.project_id, unitName: p.unit_name, handoverDate: p.handover_date, totalValuation: p.total_valuation, totalPaid: p.total_paid, otherCharges: p.other_charges, dueBalance: p.due_balance })));
                if (resInsts.data) setInstallments(resInsts.data.map(i => ({ ...i, propertyId: i.property_id, dueDate: i.due_date, statusPill: i.status_pill })));
                if (resTrans.data) setTransactions(resTrans.data.map(t => ({ ...t, propertyId: t.property_id })));
                const defaultSiteUpdates = [
                    {
                        id: 'u1',
                        projectId: 'p1',
                        project_id: 'p1',
                        date: '10 Feb 2026',
                        title: 'Slab 6 Casting Completed',
                        type: 'Announcement',
                        desc: 'Concrete casting for Slab Level 6 on Sardar Tower – Block A was successfully completed with structural inspection approval.'
                    },
                    {
                        id: 'u2',
                        projectId: 'p2',
                        project_id: 'p2',
                        date: '08 Feb 2026',
                        title: 'Piling & Foundation Milestone Completed',
                        type: 'Announcement',
                        desc: 'Subterranean piling and foundation reinforced casting for Green Valley Residency has reached 100% completion.'
                    }
                ];

                if (resUpdates.data && resUpdates.data.length > 0) {
                    const mappedUpdates = resUpdates.data.map(u => ({
                        ...u,
                        projectId: u.project_id || u.projectId
                    }));
                    setSiteUpdates(mappedUpdates);
                } else {
                    try {
                        const local = JSON.parse(localStorage.getItem('all_site_updates') || '[]');
                        if (local.length > 0) {
                            setSiteUpdates(local);
                        } else {
                            setSiteUpdates(defaultSiteUpdates);
                        }
                    } catch(e) {
                        setSiteUpdates(defaultSiteUpdates);
                    }
                }
                if (resTickets.data && resTickets.data.length > 0) {
                    setTickets(resTickets.data.map(t => ({
                        ...t,
                        clientId: t.client_id || t.clientId,
                        adminReply: t.admin_reply || t.adminReply
                    })));
                } else {
                    try {
                        const local = JSON.parse(localStorage.getItem('all_tickets') || '[]');
                        if (local.length > 0) setTickets(local);
                    } catch(e) {}
                }
                let publicProjectsLoaded = false;
                if (resPublicProjects && resPublicProjects.data && resPublicProjects.data.length > 0) {
                    const validPublicProjects = resPublicProjects.data
                        .filter(p => p.id !== '1' && p.id !== '2' && p.id !== '3')
                        .map(p => ({
                            id: p.id,
                            name: p.name,
                            status: p.status,
                            statusBg: p.status_bg,
                            location: p.location,
                            type: p.type,
                            image: p.image,
                            description: p.description,
                            price: p.price,
                            area: p.area
                        }));
                    
                    if (validPublicProjects.length > 0) {
                        const mergedMap = new Map();
                        PROJECTS.forEach(p => mergedMap.set(p.id, p));
                        validPublicProjects.forEach(p => mergedMap.set(p.id, { ...mergedMap.get(p.id), ...p }));
                        setPublicProjects(Array.from(mergedMap.values()));
                        publicProjectsLoaded = true;
                    }
                }

                if (!publicProjectsLoaded) {
                    try {
                        const local = JSON.parse(localStorage.getItem('all_public_projects') || '[]');
                        if (local.length > 0) {
                            const mergedMap = new Map();
                            PROJECTS.forEach(p => mergedMap.set(p.id, p));
                            local.forEach(p => mergedMap.set(p.id, { ...mergedMap.get(p.id), ...p }));
                            setPublicProjects(Array.from(mergedMap.values()));
                        } else {
                            setPublicProjects(PROJECTS);
                        }
                    } catch(e) {
                        setPublicProjects(PROJECTS);
                    }
                }

            } catch (err) {
                console.error("Error fetching data from Supabase:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // ─── Global Action Methods (Writes to Supabase) ─────────

    const updateProjectPhase = async (projectId, newPhase) => {
        const numericPhase = parseInt(newPhase) || 1;

        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;
            const currentPhases = p.phases || [
                { id: 1, name: 'Piling & Foundation', date: 'Completed Dec 23', progress: 100 },
                { id: 2, name: 'Structural Basement & Columns', date: 'Completed Feb 24', progress: 100 },
                { id: 3, name: 'Slabs Casting & Brickwork', date: 'Target: May 26', progress: 85 },
                { id: 4, name: 'Finishing & Handover', date: 'Target: Dec 26', progress: 0 },
            ];

            const updatedPhases = currentPhases.map(ph => {
                if (ph.id < numericPhase) return { ...ph, progress: 100 };
                if (ph.id === numericPhase) return { ...ph, progress: ph.progress === 100 ? 85 : (ph.progress || 85) };
                return { ...ph, progress: 0 };
            });

            try {
                localStorage.setItem(`project_phase_${projectId}`, String(numericPhase));
                localStorage.setItem(`project_milestones_${projectId}`, JSON.stringify(updatedPhases));
            } catch (e) {}

            return {
                ...p,
                progressPhase: numericPhase,
                progress_phase: numericPhase,
                phases: updatedPhases
            };
        }));

        try {
            await supabase.from('projects').update({ progress_phase: numericPhase }).eq('id', projectId);
        } catch (err) {
            console.warn("Supabase progress_phase update note:", err);
        }
    };

    const updateProjectMilestones = async (projectId, updatedPhases) => {
        const incomplete = updatedPhases.find(ph => ph.progress < 100);
        const derivedPhase = incomplete ? incomplete.id : updatedPhases.length;

        setProjects(prev => prev.map(p => p.id === projectId ? { 
            ...p, 
            phases: updatedPhases,
            progressPhase: derivedPhase,
            progress_phase: derivedPhase
        } : p));
        
        try {
            localStorage.setItem(`project_milestones_${projectId}`, JSON.stringify(updatedPhases));
            localStorage.setItem(`project_phase_${projectId}`, String(derivedPhase));
        } catch (e) {
            console.error("Error saving milestones to localStorage:", e);
        }

        try {
            await supabase.from('projects').update({ phases: updatedPhases, progress_phase: derivedPhase }).eq('id', projectId);
        } catch (err) {
            console.warn("Supabase phase update note:", err);
        }
    };

    const resolveTicket = async (id) => {
        setTickets(prev => {
            const updated = prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t);
            try { localStorage.setItem('all_tickets', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });
        try {
            await supabase.from('tickets').update({ status: 'Resolved' }).eq('id', id);
        } catch(err) {}
    };

    const replyToTicket = async (ticketId, replyMsg, resolve = true) => {
        const updatedStatus = resolve ? 'Resolved' : 'In Review';

        setTickets(prev => {
            const updated = prev.map(t => t.id === ticketId ? { ...t, adminReply: replyMsg, status: updatedStatus } : t);
            try { localStorage.setItem('all_tickets', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });

        try {
            const dbPayload = {
                admin_reply: replyMsg,
                status: updatedStatus
            };
            const { error } = await supabase.from('tickets').update(dbPayload).eq('id', ticketId);
            if (error) console.warn("[DatabaseContext] Supabase ticket reply note:", error.message);
        } catch(err) {
            console.warn("[DatabaseContext] Supabase ticket reply error:", err.message);
        }
    };

    const addProject = async (newProject) => {
        const projId = newProject.id || `p${projects.length + 1}`;
        const totalU = parseInt(newProject.totalUnits) || 0;
        const projectItem = {
            id: projId,
            name: newProject.name,
            totalUnits: totalU,
            progressPhase: 1,
            phases: [
                { id: 1, name: 'Piling & Foundation', date: 'Target: Q1 2026', progress: 0 },
                { id: 2, name: 'Structural Basement & Columns', date: 'Target: Q2 2026', progress: 0 },
                { id: 3, name: 'Slabs Casting & Brickwork', date: 'Target: Q3 2026', progress: 0 },
                { id: 4, name: 'Finishing & Handover', date: 'Target: Q4 2026', progress: 0 },
            ]
        };

        // 1. Optimistic state update
        setProjects(prev => [...prev, projectItem]);

        // 2. Supabase insert
        const dbPayload = {
            id: projId,
            name: newProject.name,
            total_units: totalU,
            progress_phase: 1
        };
        try {
            const { error } = await supabase.from('projects').insert([dbPayload]);
            if (error) console.warn("Supabase project insert note:", error.message);
        } catch (err) {
            console.error("Error inserting project to Supabase:", err);
        }
        return true;
    };

    const addClientTicket = async (clientId, type, subject, message) => {
        const newTicket = {
            id: `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
            client_id: clientId,
            subject: subject || `${type} Inquiry`,
            status: 'Pending',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            message
        };
        const { data, error } = await supabase.from('tickets').insert([newTicket]).select();
        if (!error && data) setTickets(prev => [data[0], ...prev]);
    };

    const addSiteUpdate = async (projectId, subject, message) => {
        const updateId = 'upd_' + Date.now();
        const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const formatted = {
            id: updateId,
            projectId: projectId,
            project_id: projectId,
            date: dateStr,
            title: subject,
            type: 'Announcement',
            desc: message
        };

        setSiteUpdates(prev => {
            const updated = [formatted, ...prev];
            try { localStorage.setItem('all_site_updates', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });

        try {
            const dbPayload = {
                id: updateId,
                project_id: projectId,
                date: dateStr,
                title: subject,
                type: 'Announcement',
                "desc": message
            };
            const { error } = await supabase.from('site_updates').insert([dbPayload]);
            if (error) console.warn("[DatabaseContext] Supabase addSiteUpdate note:", error.message);
        } catch(err) {
            console.warn("[DatabaseContext] Supabase addSiteUpdate error:", err.message);
        }
    };

    const addLead = async (lead) => {
        const newLead = {
            ...lead,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        const { data, error } = await supabase.from('leads').insert([newLead]).select();
        if (!error && data) setLeads(prev => [data[0], ...prev]);
    };

    const updateLeadStatus = async (id, newStatus) => {
        const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
        if (!error) {
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
            
            if (newStatus === 'Converted') {
                const lead = leads.find(l => l.id === id);
                if (lead) {
                    const newApp = {
                        name: lead.name,
                        unit: lead.interest || 'Pending Unit Assignment',
                        stage: 'KYC Verification',
                        status: 'Pending',
                        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    };
                    const { data: appData, error: appErr } = await supabase.from('applications').insert([newApp]).select();
                    if (!appErr && appData) {
                        setApplications(prev => [appData[0], ...prev]);
                    }
                }
            }
        }
    };

    const addClient = async (client, projectId = null) => {
        const { data, error } = await supabase.from('clients').insert([client]).select();
        if (!error && data) {
            setClients(prev => [data[0], ...prev]);
            
            if (projectId && projectId !== 'all') {
                const newProperty = {
                    client_id: data[0].id,
                    project_id: projectId,
                    unit_name: 'Pending Assignment',
                    location: 'TBD',
                    area: '0 sqft',
                    handover_date: 'TBD',
                    total_valuation: '0',
                    total_paid: '0',
                    other_charges: '0',
                    due_balance: '0'
                };
                const { data: propData, error: propError } = await supabase.from('properties').insert([newProperty]).select();
                if (!propError && propData) {
                    setProperties(prev => [...prev, {
                        ...propData[0],
                        clientId: propData[0].client_id,
                        projectId: propData[0].project_id,
                        unitName: propData[0].unit_name,
                        handoverDate: propData[0].handover_date,
                        totalValuation: propData[0].total_valuation,
                        totalPaid: propData[0].total_paid,
                        otherCharges: propData[0].other_charges,
                        dueBalance: propData[0].due_balance
                    }]);
                }
            }
        }
    };

    const updateClient = async (id, updatedClient) => {
        const { error } = await supabase.from('clients').update(updatedClient).eq('id', id);
        if (!error) setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedClient } : c));
    };

    const updateProperty = async (id, updatedProperty) => {
        // Map back to snake_case
        const dbPayload = {
            ...(updatedProperty.unitName && { unit_name: updatedProperty.unitName }),
            ...(updatedProperty.location && { location: updatedProperty.location }),
            ...(updatedProperty.area && { area: updatedProperty.area }),
            ...(updatedProperty.handoverDate && { handover_date: updatedProperty.handoverDate }),
            ...(updatedProperty.totalValuation && { total_valuation: updatedProperty.totalValuation }),
            ...(updatedProperty.totalPaid && { total_paid: updatedProperty.totalPaid }),
            ...(updatedProperty.otherCharges && { other_charges: updatedProperty.otherCharges }),
            ...(updatedProperty.dueBalance && { due_balance: updatedProperty.dueBalance }),
        };
        const { error } = await supabase.from('properties').update(dbPayload).eq('id', id);
        if (!error) setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updatedProperty } : p));
    };

    const addInstallment = async (installmentData) => {
        const dbPayload = {
            property_id: installmentData.propertyId,
            installment: installmentData.installment,
            due_date: installmentData.dueDate,
            amount: installmentData.amount,
            status: installmentData.status,
            status_pill: installmentData.statusPill,
            active: installmentData.active
        };
        const { data, error } = await supabase.from('installments').insert([dbPayload]).select();
        if (!error && data) setInstallments(prev => [...prev, { ...data[0], propertyId: data[0].property_id, dueDate: data[0].due_date, statusPill: data[0].status_pill }]);
    };

    const updateInstallment = async (id, updatedInstallment) => {
        const dbPayload = {
            ...(updatedInstallment.installment && { installment: updatedInstallment.installment }),
            ...(updatedInstallment.dueDate && { due_date: updatedInstallment.dueDate }),
            ...(updatedInstallment.amount && { amount: updatedInstallment.amount }),
            ...(updatedInstallment.status && { status: updatedInstallment.status }),
            ...(updatedInstallment.statusPill && { status_pill: updatedInstallment.statusPill }),
            ...(updatedInstallment.active !== undefined && { active: updatedInstallment.active }),
        };
        const { error } = await supabase.from('installments').update(dbPayload).eq('id', id);
        if (!error) setInstallments(prev => prev.map(i => i.id === id ? { ...i, ...updatedInstallment } : i));
    };

    const deleteInstallment = async (id) => {
        const { error } = await supabase.from('installments').delete().eq('id', id);
        if (!error) setInstallments(prev => prev.filter(i => i.id !== id));
    };

    const addTransaction = async (transactionData) => {
        const dbPayload = {
            property_id: transactionData.propertyId,
            date: transactionData.date,
            type: transactionData.type,
            amount: transactionData.amount
        };
        const { data, error } = await supabase.from('transactions').insert([dbPayload]).select();
        if (!error && data) setTransactions(prev => [{ ...data[0], propertyId: data[0].property_id }, ...prev]);
    };

    const addPublicProject = async (newProj) => {
        const id = String(Date.now());
        const formatted = { ...newProj, id };

        setPublicProjects(prev => {
            const updated = [...prev, formatted];
            try { localStorage.setItem('all_public_projects', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });

        setProjects(prev => [...prev, { id, name: newProj.name, progressPhase: 1, totalUnits: parseInt(newProj.totalUnits) || 20 }]);

        try {
            const dbPayload = {
                id,
                name: newProj.name,
                status: newProj.status,
                status_bg: newProj.statusBg,
                location: newProj.location,
                type: newProj.type,
                image: newProj.image,
                description: newProj.description,
                price: newProj.price,
                area: newProj.area
            };
            const { error } = await supabase.from('public_projects').insert([dbPayload]);
            if (error) console.warn("[DatabaseContext] Supabase insert note:", error.message);
        } catch (err) {
            console.warn("[DatabaseContext] Supabase insert error:", err.message);
        }
    };

    const updatePublicProject = async (id, updatedProj) => {
        setPublicProjects(prev => {
            const updated = prev.map(p => p.id === id ? { ...p, ...updatedProj } : p);
            try { localStorage.setItem('all_public_projects', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });

        setProjects(prev => prev.map(p => p.id === id ? { ...p, name: updatedProj.name || p.name } : p));

        try {
            const dbPayload = {
                name: updatedProj.name,
                status: updatedProj.status,
                status_bg: updatedProj.statusBg,
                location: updatedProj.location,
                type: updatedProj.type,
                image: updatedProj.image,
                description: updatedProj.description,
                price: updatedProj.price,
                area: updatedProj.area
            };
            const { error } = await supabase.from('public_projects').update(dbPayload).eq('id', id);
            if (error) console.warn("[DatabaseContext] Supabase update note:", error.message);
        } catch (err) {
            console.warn("[DatabaseContext] Supabase update error:", err.message);
        }
    };

    const advanceApplicationStage = async (id) => {
        const app = applications.find(a => a.id === id);
        if (!app) return;
        
        const stages = ['KYC Verification', 'Financial Review', 'Management Approval', 'Completed'];
        const statuses = ['Pending', 'In Progress', 'Action Required', 'Approved'];
        const currentIndex = stages.indexOf(app.stage);
        
        if (currentIndex < stages.length - 1) {
            const newStage = stages[currentIndex + 1];
            const newStatus = statuses[currentIndex + 1];
            
            const { error } = await supabase.from('applications').update({ stage: newStage, status: newStatus }).eq('id', id);
            if (!error) {
                setApplications(prev => prev.map(a => a.id === id ? { ...a, stage: newStage, status: newStatus } : a));
            }
        }
    };

    const approveAllApplications = async () => {
        // Simplified for bulk update
        const { error } = await supabase.from('applications').update({ stage: 'Completed', status: 'Approved' }).neq('status', 'Approved');
        if (!error) {
            setApplications(prev => prev.map(app => ({ ...app, stage: 'Completed', status: 'Approved' })));
        }
    };

    const onboardClient = async (applicationId, projectId = 'p1', installmentConfig = null, unitName = null) => {
        const app = applications.find(a => a.id === applicationId);
        if (!app) return;

        // Fetch lead detail matching by name to fetch real email and phone credentials if they aren't parsed on app
        const { data: leadData } = await supabase.from('leads').select('*').eq('name', app.name).maybeSingle();

        const newClient = {
            name: app.name,
            email: app.email || leadData?.email || `${app.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: app.phone || leadData?.phone || '+880 1800-000000',
            status: 'Active'
        };

        const { data: clientData, error: clientError } = await supabase.from('clients').insert([newClient]).select();
        if (clientError || !clientData) return;

        const newClientId = clientData[0].id;
        
        const newProperty = {
            client_id: newClientId,
            project_id: projectId,
            unit_name: unitName || app.unit || 'Not specified',
            location: 'Main Block',
            area: '1,500 sqft',
            handover_date: 'Jan 2027',
            total_valuation: '0',
            total_paid: '0',
            other_charges: '0',
            due_balance: '0'
        };

        const { data: propData, error: propErr } = await supabase.from('properties').insert([newProperty]).select();
        if (propErr || !propData) return;

        const insertedProperty = propData[0];

        // Generate installments if config is present and totalAmount > 0
        if (installmentConfig && installmentConfig.numInstallments && installmentConfig.totalAmount) {
            const { numInstallments, freq, startDate, totalAmount } = installmentConfig;
            const valuation = parseFloat(String(totalAmount).replace(/,/g, '')) || 0;
            if (valuation > 0) {
                const installmentAmount = Math.round(valuation / numInstallments);
                let currentD = new Date(startDate);
                
                const listToInsert = [];
                for (let i = 1; i <= numInstallments; i++) {
                    const installmentName = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Installment`;
                    const dateStr = currentD.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    
                    listToInsert.push({
                        property_id: insertedProperty.id,
                        installment: installmentName,
                        due_date: dateStr,
                        amount: installmentAmount.toLocaleString('en-IN'),
                        status: 'Pending',
                        status_pill: 'bg-amber-100 text-amber-700',
                        active: i === 1
                    });

                    if (freq === 'Monthly') {
                        currentD.setMonth(currentD.getMonth() + 1);
                    } else if (freq === 'Quarterly') {
                        currentD.setMonth(currentD.getMonth() + 3);
                    } else if (freq === 'Semi-Annually') {
                        currentD.setMonth(currentD.getMonth() + 6);
                    }
                }
                const { data: instData } = await supabase.from('installments').insert(listToInsert).select();
                if (instData) {
                    setInstallments(prev => [...prev, ...instData.map(i => ({ ...i, propertyId: i.property_id, dueDate: i.due_date, statusPill: i.status_pill }))]);
                }
            }
        }

        await supabase.from('applications').delete().eq('id', applicationId);
        
        setClients(prev => [clientData[0], ...prev]);
        setProperties(prev => [...prev, {
            ...insertedProperty,
            clientId: insertedProperty.client_id,
            projectId: insertedProperty.project_id,
            unitName: insertedProperty.unit_name,
            handoverDate: insertedProperty.handover_date,
            totalValuation: insertedProperty.total_valuation,
            totalPaid: insertedProperty.total_paid,
            otherCharges: insertedProperty.other_charges,
            dueBalance: insertedProperty.due_balance
        }]);
        setApplications(prev => prev.filter(a => a.id !== applicationId));
    };

    const addApplication = async (newApp) => {
        const { data, error } = await supabase.from('applications').insert([newApp]).select();
        if (!error && data) {
            const app = data[0];
            let parsedApp = app;
            try {
                if (app.unit && app.unit.startsWith('{')) {
                    const parsed = JSON.parse(app.unit);
                    parsedApp = {
                        ...app,
                        email: parsed.email,
                        phone: parsed.phone,
                        unit: parsed.unit || 'Not specified'
                    };
                }
            } catch(e) {}
            setApplications(prev => [parsedApp, ...prev]);
        } else if (error) {
            console.error("Error adding application:", error.message);
        }
    };

    const rejectApplication = async (applicationId) => {
        const { error } = await supabase.from('applications').delete().eq('id', applicationId);
        if (!error) {
            setApplications(prev => prev.filter(a => a.id !== applicationId));
        } else {
            console.error("Error rejecting application:", error.message);
            alert("Error rejecting client request: " + error.message);
        }
    };

    const deleteClient = async (id) => {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (!error) {
            setClients(prev => prev.filter(c => c.id !== id));
            setProperties(prev => prev.filter(p => p.clientId !== id));
            setTickets(prev => prev.filter(t => t.clientId !== id));
        } else {
            console.error("Error deleting client:", error.message);
            alert("Error deleting client: " + error.message);
        }
    };

    const deleteLead = async (id) => {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (!error) {
            setLeads(prev => prev.filter(l => l.id !== id));
        } else {
            console.error("Error deleting lead:", error.message);
            alert("Error deleting lead: " + error.message);
        }
    };

    const deletePublicProject = async (id) => {
        setPublicProjects(prev => {
            const updated = prev.filter(p => p.id !== id);
            try { localStorage.setItem('all_public_projects', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });

        setProjects(prev => prev.filter(p => p.id !== id));

        try {
            const { error } = await supabase.from('public_projects').delete().eq('id', id);
            if (error) console.warn("[DatabaseContext] Supabase delete note:", error.message);
        } catch (err) {
            console.warn("[DatabaseContext] Supabase delete error:", err.message);
        }
    };

    const addProjectPhoto = async (projectId, dataUrl, caption = '') => {
        const photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const newPhoto = {
            id: photoId,
            project_id: projectId,
            url: dataUrl,
            caption: caption || 'Project Photo',
            date: dateStr
        };

        const formatted = {
            id: photoId,
            projectId: projectId,
            url: dataUrl,
            caption: caption || 'Project Photo',
            date: dateStr
        };

        setProjectPhotos(prev => {
            const updated = [formatted, ...prev];
            try { localStorage.setItem('all_project_photos', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });

        try {
            await supabase.from('project_photos').insert([newPhoto]);
        } catch(err) {
            console.warn("Supabase photo insert note:", err);
        }
    };

    const deleteProjectPhoto = async (photoId) => {
        setProjectPhotos(prev => {
            const updated = prev.filter(p => p.id !== photoId);
            try { localStorage.setItem('all_project_photos', JSON.stringify(updated)); } catch(e) {}
            return updated;
        });

        try {
            await supabase.from('project_photos').delete().eq('id', photoId);
        } catch(err) {
            console.warn("Supabase photo delete note:", err);
        }
    };

    const value = useMemo(() => ({
        deleteClient,
        deleteLead,
        deletePublicProject,
        deleteInstallment,
        projectPhotos,
        addProjectPhoto,
        deleteProjectPhoto,
        clients,
        leads,
        applications,
        projects,
        properties,
        installments,
        transactions,
        siteUpdates,
        tickets,
        updateProjectPhase,
        updateProjectMilestones,
        resolveTicket,
        replyToTicket,
        addClientTicket,
        addSiteUpdate,
        addLead,
        updateLeadStatus,
        addClient,
        updateClient,
        updateProperty,
        addInstallment,
        updateInstallment,
        addTransaction,
        addProject,
        publicProjects,
        addPublicProject,
        updatePublicProject,
        advanceApplicationStage,
        approveAllApplications,
        onboardClient,
        addApplication,
        rejectApplication,
        loading
    }), [
        clients, leads, applications, projects, properties,
        installments, transactions, siteUpdates, tickets,
        projectPhotos, publicProjects, loading
    ]);

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) throw new Error("useDatabase must be used within a DatabaseProvider");
    return context;
};
