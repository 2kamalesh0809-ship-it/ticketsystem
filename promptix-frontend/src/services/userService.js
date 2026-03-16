import api from './api';

const userService = {
    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        if (response.data) {
            // Update local storage user info
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.put('/users/change-password', passwordData);
        return response.data;
    },

    updateAvatar: async (formData) => {
        const response = await api.put('/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, avatar: response.data.avatar };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    }
};

export default userService;
