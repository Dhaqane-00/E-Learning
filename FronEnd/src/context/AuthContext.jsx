import React, { createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      Cookies.remove('token');
      Cookies.remove('user');
      localStorage.removeItem('user');
      navigate('/login');
      return 200;
    } catch (error) {
      console.error('Error during logout:', error);
      return 500;
    }
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 