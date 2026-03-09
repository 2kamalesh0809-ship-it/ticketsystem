import api from './api';

const mapCustomer = (customer) => ({
    id: customer._id || customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    totalTickets: customer.totalTickets !== undefined ? customer.totalTickets : (customer.tickets?.length || 0),
    lastContact: customer.lastContact ? new Date(customer.lastContact).toISOString().split('T')[0] :
        (customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : ''),
    tickets: customer.tickets || []
});

const customerService = {
    getAllCustomers: async () => {
        const response = await api.get('/customers');
        return response.data.map(mapCustomer);
    },

    createCustomer: async (customerData) => {
        const response = await api.post('/customers', customerData);
        return mapCustomer(response.data);
    },

    getCustomerById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return mapCustomer(response.data);
    },

    updateCustomer: async (id, customerData) => {
        const response = await api.put(`/customers/${id}`, customerData);
        return mapCustomer(response.data);
    },

    deleteCustomer: async (id) => {
        await api.delete(`/customers/${id}`);
    }
};

export default customerService;
