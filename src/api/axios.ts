import axios from 'axios';

const portApi = import.meta.env.VITE_PORT_API;

const api = axios.create({
    baseURL: `http://localhost:${portApi || '3000'}/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
