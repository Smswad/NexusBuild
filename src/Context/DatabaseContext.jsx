import { createContext, useContext, useState, useEffect } from 'react';
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
                    resProps, resInsts, resTrans, resUpdates, resTickets, resPublicProjects
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
                    supabase.from('public_projects').select('*')
                ]);

                if (resClients.data) setClients(resClients.data);
                if (resLeads.data) setLeads(resLeads.data);
                if (resApps.data) setApplications(resApps.data);
                if (resProjects.data) setProjects(resProjects.data.map(p => ({ ...p, progressPhase: p.progress_phase, totalUnits: p.total_units })));
                if (resProps.data) setProperties(resProps.data.map(p => ({ ...p, clientId: p.client_id, projectId: p.project_id, unitName: p.unit_name, handoverDate: p.handover_date, totalValuation: p.total_valuation, totalPaid: p.total_paid, otherCharges: p.other_charges, dueBalance: p.due_balance })));
                if (resInsts.data) setInstallments(resInsts.data.map(i => ({ ...i, propertyId: i.property_id, dueDate: i.due_date, statusPill: i.status_pill })));
                if (resTrans.data) setTransactions(resTrans.data.map(t => ({ ...t, propertyId: t.property_id })));
                if (resUpdates.data) setSiteUpdates(resUpdates.data.map(u => ({ ...u, projectId: u.project_id })));
                if (resTickets.data) setTickets(resTickets.data.map(t => ({ ...t, clientId: t.client_id })));
                if (resPublicProjects.data && resPublicProjects.data.length > 0) {
                    setPublicProjects(resPublicProjects.data.map(p => ({
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
                    })));
                } else if (resPublicProjects.error) {
                    console.warn("[DatabaseContext] Could not load public_projects from Supabase, using static fallback:", resPublicProjects.error.message);
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
        const { error } = await supabase.from('projects').update({ progress_phase: newPhase }).eq('id', projectId);
        if (!error) {
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, progressPhase: newPhase } : p));
        }
    };

    const resolveTicket = async (id) => {
        const { error } = await supabase.from('tickets').update({ status: 'Resolved' }).eq('id', id);
        if (!error) setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    };

    const addProject = async (newProject) => {
        const dbPayload = {
            id: newProject.id, // e.g., 'p3'
            name: newProject.name,
            total_units: parseInt(newProject.totalUnits) || 0,
            progress_phase: 1
        };
        const { data, error } = await supabase.from('projects').insert([dbPayload]).select();
        if (error) {
            console.error("Error adding project:", error);
            alert("Error adding project");
            return false;
        }
        if (data) {
            setProjects(prev => [...prev, { ...data[0], progressPhase: data[0].progress_phase, totalUnits: data[0].total_units }]);
            return true;
        }
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
        const newUpdate = {
            project_id: projectId,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            title: subject,
            type: 'Announcement',
            desc: message
        };
        const { data, error } = await supabase.from('site_updates').insert([newUpdate]).select();
        if (!error && data) setSiteUpdates(prev => [data[0], ...prev]);
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
        if (!error) setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
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
            ...(updatedInstallment.status && { status: updatedInstallment.status }),
            ...(updatedInstallment.statusPill && { status_pill: updatedInstallment.statusPill }),
            ...(updatedInstallment.active !== undefined && { active: updatedInstallment.active }),
        };
        const { error } = await supabase.from('installments').update(dbPayload).eq('id', id);
        if (!error) setInstallments(prev => prev.map(i => i.id === id ? { ...i, ...updatedInstallment } : i));
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

        // Optimistic UI update
        setPublicProjects(prev => [...prev, { ...newProj, id }]);

        const { error } = await supabase.from('public_projects').insert([dbPayload]);
        if (error) {
            console.error("Error adding public project to Supabase:", error.message);
            alert("Error saving project to database: " + error.message);
        }
    };

    const updatePublicProject = async (id, updatedProj) => {
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

        // Optimistic UI update
        setPublicProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedProj } : p));

        const { error } = await supabase.from('public_projects').update(dbPayload).eq('id', id);
        if (error) {
            console.error("Error updating public project in Supabase:", error.message);
            alert("Error updating project in database: " + error.message);
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

    const onboardClient = async (applicationId) => {
        const app = applications.find(a => a.id === applicationId);
        if (!app) return;

        // Note: Real world onboarding might require calling a Supabase Edge Function to create the auth.users account first.
        // For simplicity, we just create the public.client record here.
        const newClient = {
            name: app.name,
            email: `${app.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: '+880 1800-000000',
            status: 'Active'
        };

        const { data: clientData, error: clientError } = await supabase.from('clients').insert([newClient]).select();
        if (clientError || !clientData) return;

        const newClientId = clientData[0].id;
        
        const newProperty = {
            client_id: newClientId,
            project_id: 'p1', // Defaulting to p1 for mock
            unit_name: app.unit,
            location: 'Main Block',
            area: '1,500 sqft',
            handover_date: 'Jan 2027',
            total_valuation: '1,00,00,000',
            total_paid: '0',
            other_charges: '0',
            due_balance: '1,00,00,000'
        };

        const { data: propData } = await supabase.from('properties').insert([newProperty]).select();

        await supabase.from('applications').delete().eq('id', applicationId);
        
        setClients(prev => [clientData[0], ...prev]);
        if (propData) setProperties(prev => [...prev, propData[0]]);
        setApplications(prev => prev.filter(a => a.id !== applicationId));
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
        setPublicProjects(prev => prev.filter(p => p.id !== id));
        const { error } = await supabase.from('public_projects').delete().eq('id', id);
        if (error) {
            console.error("Error deleting public project:", error.message);
            alert("Error deleting project: " + error.message);
        }
    };

    const value = {
        deleteClient,
        deleteLead,
        deletePublicProject,
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
        resolveTicket,
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
        loading
    };

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
