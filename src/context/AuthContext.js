import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
    });

    const loginAuth = (userData) => {
        setAuthState({ isAuthenticated: true, user: userData });
    };

    const logout = async () => {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('idToken');
        setAuthState({ isAuthenticated: false, user: null });
    };

    return (
        <AuthContext.Provider value={{ ...authState, loginAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};