import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import customerService from '../services/customerService';

const CustomerContext = createContext();

export const useCustomers = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const addCustomer = async (customerData) => {
        try {
            const newCustomer = await customerService.createCustomer(customerData);
            setCustomers(prev => [newCustomer, ...prev]);
            return newCustomer;
        } catch (error) {
            console.error('Error adding customer:', error);
            throw error;
        }
    };

    const updateCustomer = async (id, updatedData) => {
        try {
            const updatedCustomer = await customerService.updateCustomer(id, updatedData);
            setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    };

    const deleteCustomer = async (id) => {
        try {
            await customerService.deleteCustomer(id);
            setCustomers(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    };

    return (
        <CustomerContext.Provider value={{ customers, loading, addCustomer, updateCustomer, deleteCustomer, refreshCustomers: fetchCustomers }}>
            {children}
        </CustomerContext.Provider>
    );
};
