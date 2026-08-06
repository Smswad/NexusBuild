import React, { createContext, useContext, useState, useMemo } from 'react';
import { useDatabase } from './DatabaseContext';

const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
    const db = useDatabase();
    const [activeProject, setActiveProject] = useState('all');

    const value = useMemo(() => {
        // If 'all' is selected or db isn't fully loaded, return unfiltered data
        if (activeProject === 'all' || !db.projects) {
            return { ...db, activeProject, setActiveProject };
        }

        // Filter data based on activeProject
        const filteredProperties = db.properties ? db.properties.filter(p => p.projectId === activeProject) : [];
        const filteredPropertyIds = filteredProperties.map(p => p.id);
        
        const filteredTransactions = db.transactions ? db.transactions.filter(t => filteredPropertyIds.includes(t.propertyId)) : [];
        const filteredInstallments = db.installments ? db.installments.filter(i => filteredPropertyIds.includes(i.propertyId)) : [];
        
        const filteredClientIds = filteredProperties.map(p => p.clientId);
        const filteredClients = db.clients ? db.clients.filter(c => filteredClientIds.includes(c.id)) : [];
        
        const filteredSiteUpdates = db.siteUpdates ? db.siteUpdates.filter(u => u.projectId === activeProject) : [];
        const filteredTickets = db.tickets ? db.tickets.filter(t => filteredClientIds.includes(t.clientId)) : [];

        // Leads aren't strictly tied to projects in the DB schema, so we return all leads
        // Applications are also not tied to projects yet.

        return {
            ...db,
            activeProject,
            setActiveProject,
            properties: filteredProperties,
            transactions: filteredTransactions,
            installments: filteredInstallments,
            clients: filteredClients,
            siteUpdates: filteredSiteUpdates,
            tickets: filteredTickets
        };
    }, [db, activeProject]);

    return (
        <AdminDataContext.Provider value={value}>
            {children}
        </AdminDataContext.Provider>
    );
};

export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (!context) throw new Error("useAdminData must be used within an AdminDataProvider");
    return context;
};
