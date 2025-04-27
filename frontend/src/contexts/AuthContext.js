import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken) {
      // Validate token with backend or decode JWT to get user info
      // For now, we'll just set the user based on the stored role
      setCurrentUser({ role: storedRole });
      setToken(storedToken);
      setUserRole(storedRole);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // For demo purposes, we'll use mock authentication
      // In a real app, this would call the backend API

      let data;

      // Check credentials
      if (email === 'admin@example.com' && password === 'admin123') {
        // Admin login
        data = { token: 'mock-admin-token', role: 'admin' };
      } else if (email === 'practice@example.com' && password === 'practice123') {
        // Practice user login
        data = { token: 'mock-practice-token', role: 'practice' };
      } else {
        // In a real app, this would be handled by the backend
        throw new Error('Invalid email or password');
      }

      // Store token and user role in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);

      // Update state
      setToken(data.token);
      setUserRole(data.role);
      setCurrentUser({ role: data.role });

      return { success: true, role: data.role };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
    setCurrentUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return userRole === 'admin';
  };

  // Check if user is practice user
  const isPracticeUser = () => {
    return userRole === 'practice';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    currentUser,
    loading,
    token,
    userRole,
    login,
    logout,
    isAdmin,
    isPracticeUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
