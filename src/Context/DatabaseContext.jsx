import { createContext, useContext, useState } from 'react';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
    // Global data mimicking the database schema
    
    const [clients, setClients] = useState([
        { id: 'client_1', name: 'M. A. Rahman', email: 'rahman@example.com', phone: '+880 1711-000000', status: 'Active' },
        { id: 'client_2', name: 'Syeda Fatima', email: 'fatima@example.com', phone: '+880 1722-000000', status: 'Active' },
    ]);

    const [leads, setLeads] = useState([
        { id: 'L-101', name: 'Zahirul Islam', phone: '01711-234567', interest: 'Sardar Tower - 3B', source: 'Facebook Ad', status: 'New', date: '05 Aug 2026' },
        { id: 'L-102', name: 'Farzana Chowdhury', phone: '01819-987654', interest: 'Green Valley - 12A', source: 'Website', status: 'Contacted', date: '04 Aug 2026' },
        { id: 'L-103', name: 'Kamal Uddin', phone: '01912-345678', interest: 'Sardar Tower - 8C', source: 'Referral', status: 'Qualified', date: '02 Aug 2026' },
        { id: 'L-104', name: 'Nusrat Jahan', phone: '01678-112233', interest: 'Green Valley - Penthouse', source: 'Walk-in', status: 'Converted', date: '28 Jul 2026' },
    ]);

    const [applications, setApplications] = useState([
        { id: 'APP-1001', name: 'Tariqul Islam', unit: 'Sardar Tower - 14A', stage: 'KYC Verification', status: 'Pending', date: '04 Aug 2026' },
        { id: 'APP-1002', name: 'Sabrina Rahman', unit: 'Green Valley - 2B', stage: 'Financial Review', status: 'In Progress', date: '03 Aug 2026' },
        { id: 'APP-1003', name: 'Md. Al Amin', unit: 'Sardar Tower - 9C', stage: 'Management Approval', status: 'Action Required', date: '01 Aug 2026' },
        { id: 'APP-1004', name: 'Farzana Haque', unit: 'Green Valley - 5A', stage: 'Completed', status: 'Approved', date: '28 Jul 2026' },
    ]);

    const [projects, setProjects] = useState([
        { id: 'p1', name: 'Sardar Tower – Block A', progressPhase: 3 },
        { id: 'p2', name: 'Green Valley Residency', progressPhase: 1 },
    ]);

    const [properties, setProperties] = useState([
        { id: 'prop_1', clientId: 'client_1', projectId: 'p1', unitName: 'Apt 5A, Type-B', location: 'Sardar Tower, Block D', area: '1,850 sqft', handoverDate: 'Dec 2026', totalValuation: '1,25,000,000', totalPaid: '75,00,000', otherCharges: '50,000', dueBalance: '50,50,000' },
        { id: 'prop_2', clientId: 'client_2', projectId: 'p1', unitName: 'Apt 4B, Type-A', location: 'Sardar Tower, Block D', area: '2,100 sqft', handoverDate: 'Dec 2026', totalValuation: '1,50,000,000', totalPaid: '45,00,000', otherCharges: '50,000', dueBalance: '1,05,50,000' },
    ]);

    const [installments, setInstallments] = useState([
        { id: 'inst_1', propertyId: 'prop_1', installment: 'Installment 01', dueDate: '10 Jan 2024', amount: '25,00,000', status: 'Paid', statusPill: 'bg-[#DEF7EC] text-[#03543F]' },
        { id: 'inst_2', propertyId: 'prop_1', installment: 'Installment 02', dueDate: '10 Feb 2024', amount: '25,00,000', status: 'Paid', statusPill: 'bg-[#DEF7EC] text-[#03543F]' },
        { id: 'inst_3', propertyId: 'prop_1', installment: 'Installment 03', dueDate: '10 Mar 2024', amount: '25,00,000', status: 'Paid', statusPill: 'bg-[#DEF7EC] text-[#03543F]' },
        { id: 'inst_4', propertyId: 'prop_1', installment: 'Installment 04', dueDate: '15 Mar 2024', amount: '25,00,000', status: 'Pending', statusPill: 'bg-[#E1EFFE] text-[#1E429F]', active: true },
        { id: 'inst_5', propertyId: 'prop_1', installment: 'Installment 05', dueDate: '10 Apr 2024', amount: '25,00,000', status: 'Upcoming', statusPill: 'bg-slate-100 text-slate-600' },
    ]);

    const [transactions, setTransactions] = useState([
        { id: 'tx1', propertyId: 'prop_1', date: '05 Mar 2024', type: 'Online Payment', amount: '5,00,000' },
        { id: 'tx2', propertyId: 'prop_1', date: '10 Feb 2024', type: 'Bank Transfer', amount: '20,00,000' },
        { id: 'tx3', propertyId: 'prop_1', date: '10 Jan 2024', type: 'Initial Deposit', amount: '25,00,000' },
    ]);

    const [siteUpdates, setSiteUpdates] = useState([
        { id: 101, projectId: 'p1', date: '28 Jul 2026', title: 'Floor 3 Concrete Poured', type: 'Site Photo', desc: 'Third-floor slab concrete was poured yesterday. Curing process underway for the next 72 hours.' },
        { id: 102, projectId: 'p1', date: '22 Jul 2026', title: 'Structural Inspection Passed', type: 'Document', desc: 'City inspector signed off on Floor 1-2 steel framework. No red flags.' },
    ]);

    const [tickets, setTickets] = useState([
        { id: 'TKT-2026-081', clientId: 'client_1', subject: 'Change Order: Lobby Flooring Material', status: 'In Review', date: '01 Aug 2026', message: 'I would like to change the flooring material to marble.' },
        { id: 'TKT-2026-064', clientId: 'client_1', subject: 'Inquiry regarding Q2 invoice discrepancy', status: 'Resolved', date: '15 Jul 2026', message: 'There seems to be an extra charge on my Q2 invoice.' },
        { id: 'TKT-2026-092', clientId: 'client_2', subject: 'Delay in handing over keys', status: 'Pending', date: '04 Aug 2026', message: 'When will I get the keys to my new apartment?' }
    ]);

    // Global Admin Action Methods
    const updateProjectPhase = (projectId, newPhase) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, progressPhase: newPhase } : p));
    };

    const resolveTicket = (ticketId) => {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t));
    };

    const addClientTicket = (clientId, type, subject, message) => {
        const newTicket = {
            id: `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
            clientId,
            subject: subject || `${type} Inquiry`,
            status: 'Pending',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            message
        };
        setTickets(prev => [newTicket, ...prev]);
    };

    const addSiteUpdate = (projectId, subject, message) => {
        const newUpdate = {
            id: Date.now(),
            projectId,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            title: subject,
            type: 'Announcement',
            desc: message
        };
        setSiteUpdates(prev => [newUpdate, ...prev]);
    };

    const addLead = (lead) => {
        setLeads(prev => [{ ...lead, id: `L-${100 + prev.length + 1}`, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }, ...prev]);
    };

    const updateLeadStatus = (id, newStatus) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    };

    const addClient = (client) => {
        setClients(prev => [{ ...client, id: `client_${prev.length + 1}` }, ...prev]);
    };

    const updateClient = (id, updatedClient) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedClient } : c));
    };

    const advanceApplicationStage = (id) => {
        const stages = ['KYC Verification', 'Financial Review', 'Management Approval', 'Completed'];
        const statuses = ['Pending', 'In Progress', 'Action Required', 'Approved'];
        setApplications(prev => prev.map(app => {
            if (app.id === id) {
                const currentIndex = stages.indexOf(app.stage);
                if (currentIndex < stages.length - 1) {
                    return { ...app, stage: stages[currentIndex + 1], status: statuses[currentIndex + 1] };
                }
            }
            return app;
        }));
    };

    const approveAllApplications = () => {
        setApplications(prev => prev.map(app => ({ ...app, stage: 'Completed', status: 'Approved' })));
    };

    const value = {
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
        advanceApplicationStage,
        approveAllApplications
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
