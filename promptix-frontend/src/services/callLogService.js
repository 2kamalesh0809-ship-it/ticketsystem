import api from './api';

const mapCallLog = (log) => ({
    id: log.callId || log._id,
    mongoId: log._id,
    type: log.type,
    duration: `${log.duration}m`,
    summary: log.summary,
    linkedTicket: log.ticketId?.ticketId || '',
    ticketId: log.ticketId?._id || '',
    ticketStatus: log.ticketId?.status || '',
    customerName: log.customerId?.name || 'Unknown',
    customerId: log.customerId?._id || '',
    agentName: log.agentId?.name || 'Unknown',
    date: log.createdAt ? new Date(log.createdAt).toISOString().split('T')[0] : '',
    recordingUrl: log.recordingUrl ? `http://127.0.0.1:5000${log.recordingUrl}` : null
});

const callLogService = {
    getAllCallLogs: async () => {
        const response = await api.get('/calllogs');
        return response.data.map(mapCallLog);
    },

    getCallLogById: async (id) => {
        const response = await api.get(`/calllogs/${id}`);
        return mapCallLog(response.data);
    },

    createCallLog: async (formData) => {
        const response = await api.post('/calllogs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return mapCallLog(response.data);
    }
};

export default callLogService;
