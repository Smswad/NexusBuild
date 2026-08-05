import { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';

const ClientDataContext = createContext(null);

export const ClientDataProvider = ({ children }) => {
    const db = useDatabase();
    const [loading, setLoading] = useState(true);

    // Hardcode the active client ID for the mock
    const activeClientId = 'client_1';
    
    // Derived state from global database
    const activeClient = db.clients.find(c => c.id === activeClientId);
    const activeProperty = db.properties.find(p => p.clientId === activeClientId);
    const activeProject = db.projects.find(p => p.id === activeProperty?.projectId);

    const userProfile = {
        name: activeClient?.name,
        propertyDesc: activeProperty?.unitName + ' - ' + activeProject?.name,
        propertyName: activeProperty?.unitName,
        propertyLoc: activeProperty?.location,
        area: activeProperty?.area,
        handoverDate: activeProperty?.handoverDate
    };

    const financials = {
        totalValuation: activeProperty?.totalValuation,
        totalPaid: activeProperty?.totalPaid,
        otherCharges: activeProperty?.otherCharges,
        dueBalance: activeProperty?.dueBalance,
        installments: db.installments.filter(i => i.propertyId === activeProperty?.id),
        transactions: db.transactions.filter(t => t.propertyId === activeProperty?.id)
    };

    // Client sees only projects they have properties in
    const clientProjectIds = [...new Set(db.properties.filter(p => p.clientId === activeClientId).map(p => p.projectId))];
    const projects = db.projects.filter(p => clientProjectIds.includes(p.id));

    // Client sees updates only for their projects
    const siteUpdates = db.siteUpdates.filter(u => clientProjectIds.includes(u.projectId));

    const support = {
        exec: {
            name: 'Farhana Islam',
            role: 'Dedicated Account Exec',
            email: 'farhana@reliance.com',
            phone: '+880 1700-123456'
        },
        faqs: [
            { q: 'How do I submit a variation order request?', a: 'All variation order requests must be submitted through your assigned Project Manager via this portal. Navigate to the "Submit Request" form on the left, select "Change Order", and attach any relevant architectural sketches or vendor quotes.' },
            { q: 'When will I receive the final handover schedule?', a: 'The tentative handover date is listed under the "Project Progress" tab. A finalized, confirmed date will be issued in writing 30 days prior to the substantial completion milestone.' },
        ],
        tickets: db.tickets.filter(t => t.clientId === activeClientId)
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 300);
    }, []);

    const submitTicket = (type, subject, message) => {
        db.addClientTicket(activeClientId, type, subject, message);
        alert('Ticket submitted successfully! We will get back to you shortly.');
    };

    const downloadStatement = () => {
        window.print();
    };

    const value = {
        loading,
        userProfile,
        financials,
        projects,
        siteUpdates,
        support,
        submitTicket,
        downloadStatement
    };

    return (
        <ClientDataContext.Provider value={value}>
            {children}
        </ClientDataContext.Provider>
    );
};

export const useClientData = () => {
    const context = useContext(ClientDataContext);
    if (!context) throw new Error("useClientData must be used within a ClientDataProvider");
    return context;
};
