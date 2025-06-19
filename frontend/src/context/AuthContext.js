import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client/dist/socket.io.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Initialize socket connection
    useEffect(() => {
        if (token) {
            const newSocket = io('http://localhost:5000', {
                auth: { token }
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('lowStockAlert', (data) => {
                setNotifications(prev => [...prev, {
                    type: 'lowStock',
                    items: data.items,
                    timestamp: new Date()
                }]);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [token]);

    // Check token and get user profile on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/auth/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        setUser(response.data.user);
                    } else {
                        console.error('Auth check failed: Invalid response format');
                        logout();
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                email,
                password
            });
            
            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Login failed'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/auth/register', userData);
            
            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(newUser);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Registration failed'
                };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        if (socket) {
            socket.close();
            setSocket(null);
        }
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        notifications,
        clearNotifications,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager',
        isEmployee: user?.role === 'employee'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 