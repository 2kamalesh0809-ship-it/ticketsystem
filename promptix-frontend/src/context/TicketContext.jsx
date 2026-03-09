import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import ticketService from '../services/ticketService';

const TicketContext = createContext();

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
};

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ticketService.getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const addTicket = useCallback(async (ticketData) => {
        try {
            const newTicket = await ticketService.createTicket(ticketData);
            setTickets(prev => [newTicket, ...prev]);
            return newTicket.id;
        } catch (error) {
            console.error('Error adding ticket:', error);
            throw error;
        }
    }, []);

    const updateTicket = useCallback(async (id, updatedData) => {
        try {
            const ticket = tickets.find(t => t.id === id);
            const targetId = ticket?.mongoId || id;

            const apiData = { ...updatedData };
            if (updatedData.assignedAgent) {
                apiData.assignedMember = updatedData.assignedAgent;
            }


            const updatedTicket = await ticketService.updateTicket(targetId, apiData);
            setTickets(prev => prev.map(t => (t.id === id || t.mongoId === targetId) ? updatedTicket : t));

            // Add history
            await ticketService.addHistory(targetId, {
                action: 'Ticket Updated',
                details: `Updated: ${Object.keys(updatedData).join(', ')}`
            });
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    }, [tickets]);

    const deleteTicket = useCallback(async (id) => {
        try {
            const ticket = tickets.find(t => t.id === id);
            const targetId = ticket?.mongoId || id;
            await ticketService.deleteTicket(targetId);
            setTickets(prev => prev.filter(t => t.id !== id && t.mongoId !== targetId));
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    }, [tickets]);

    const bulkUpdateTickets = useCallback(async (ids, updatedData) => {
        try {
            for (const id of ids) {
                const ticket = tickets.find(t => t.id === id);
                const targetId = ticket?.mongoId || id;
                await ticketService.updateTicket(targetId, updatedData);
            }
            fetchTickets();
        } catch (error) {
            console.error('Error in bulk update:', error);
            throw error;
        }
    }, [tickets, fetchTickets]);

    const addNoteTemplate = useCallback(async (id, text) => {
        try {
            const ticket = tickets.find(t => t.id === id);
            const targetId = ticket?.mongoId || id;
            await ticketService.addNote(targetId, text);

            const refreshedTicket = await ticketService.getTicketById(targetId);
            setTickets(prev => prev.map(t => (t.id === id || t.mongoId === targetId) ? refreshedTicket : t));
        } catch (error) {
            console.error('Error adding note:', error);
            throw error;
        }
    }, [tickets]);

    const value = useMemo(() => ({
        tickets,
        loading,
        addTicket,
        updateTicket,
        deleteTicket,
        bulkUpdateTickets,
        addNoteTemplate,
        refreshTickets: fetchTickets
    }), [tickets, loading, addTicket, updateTicket, deleteTicket, bulkUpdateTickets, addNoteTemplate, fetchTickets]);

    return (
        <TicketContext.Provider value={value}>
            {children}
        </TicketContext.Provider>
    );
};
