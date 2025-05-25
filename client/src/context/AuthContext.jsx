import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const AuthContext = createContext(null);

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showAllShops, setShowAllShops] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get('/api/auth/verify');
      setUser(response.data.user);
      
      // If there are shops, set the first one as selected by default
      if (response.data.user.shops && response.data.user.shops.length > 0) {
        setSelectedShop(response.data.user.shops[0]);
        setShowAllShops(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId) => {
    try {
      const response = await api.post('/api/auth/login', { userId });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);

      // Set first shop as selected if available
      if (user.shops && user.shops.length > 0) {
        setSelectedShop(user.shops[0]);
        setShowAllShops(false);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSelectedShop(null);
    setShowAllShops(true);
    navigate('/login');
  };

  const selectShop = (shop) => {
    setSelectedShop(shop);
    setShowAllShops(false);
  };

  const viewAllShops = () => {
    setSelectedShop(null);
    setShowAllShops(true);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    selectedShop,
    showAllShops,
    selectShop,
    viewAllShops
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { useAuth }; 