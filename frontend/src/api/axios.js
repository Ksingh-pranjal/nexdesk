import axios from 'axios';

//backend base url to use everywhere else easily
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

//INTERCEPTOR - runs before every single request automatically and attaches JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;