//global login state
import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

//Cotext = a way to share data across ALL components
const AuthContext = createContext();

//component to wrap whole app and to provide login state to everyone
export const AuthProvider = ({ children }) => {

    //load saved user from localstorage, JSON.parse converts string back into object
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email, password) => {
        //calls backend's POST /api/auth/login
        const response = await api.post('/auth/login', { email, password });

        //response.data conatins { _id, name, email, role, token, ... }
        const { token, ...userData } = response.data;

        //save to localstorage so that refreshing the page doesn't log us out
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);