import api from './api';

const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    }
};

export default userService;
