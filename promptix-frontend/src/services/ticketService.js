import api from './api';

const mapTicket = (ticket) => ({
    id: ticket.ticketId || ticket._id,
    mongoId: ticket._id,
    customerName: ticket.customerId?.name || 'Unknown',
    phone: ticket.customerId?.phone || '',
    priority: ticket.priority,
    status: ticket.status,
    assignedAgent: ticket.assignedMember?.name || 'Unassigned',
    source: ticket.source || 'Manual',

    createdDate: ticket.createdAt ? new Date(ticket.createdAt).toISOString().split('T')[0] : '',
    createdAt: ticket.createdAt,
    description: ticket.description,
    subject: ticket.subject,
    email: ticket.customerId?.email || '',
    notes: (ticket.notes || []).map(n => ({
        id: n._id,
        text: n.text,
        author: n.author,
        date: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString()
    })),
    history: (ticket.history || []).map(h => ({
        id: h._id,
        action: h.action,
        user: h.user,
        details: h.details,
        date: h.createdAt ? new Date(h.createdAt).toISOString() : new Date().toISOString()
    }))
});

const ticketService = {
    getAllTickets: async () => {
        const response = await api.get('/tickets');
        return response.data.map(mapTicket);
    },

    createTicket: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return mapTicket(response.data);
    },

    getTicketById: async (id) => {
        const response = await api.get(`/tickets/${id}`);
        return mapTicket(response.data);
    },

    updateTicket: async (id, ticketData) => {
        const response = await api.put(`/tickets/${id}`, ticketData);
        return mapTicket(response.data);
    },

    deleteTicket: async (id) => {
        await api.delete(`/tickets/${id}`);
    },

    addNote: async (ticketId, noteText) => {
        const response = await api.post(`/tickets/${ticketId}/notes`, { text: noteText });
        return response.data;
    },

    addHistory: async (ticketId, historyData) => {
        const response = await api.post(`/tickets/${ticketId}/history`, historyData);
        return response.data;
    }
};

export default ticketService;
