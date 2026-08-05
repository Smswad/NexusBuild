import { createContext, useContext } from 'react';
import { useDatabase } from './DatabaseContext';

const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
    const db = useDatabase();

    // The admin has full access to the database directly
    return (
        <AdminDataContext.Provider value={db}>
            {children}
        </AdminDataContext.Provider>
    );
};

export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (!context) throw new Error("useAdminData must be used within an AdminDataProvider");
    return context;
};
