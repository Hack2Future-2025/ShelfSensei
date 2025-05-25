import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Vendors from './pages/Vendors';
import Inventory from './pages/Inventory';
import Forecasting from './pages/Forecasting';
import Observations from './pages/Observations';
import Login from './pages/Login';
import IdleTimeoutDialog from './components/IdleTimeoutDialog';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has shops
  if (!user.shops || user.shops.length === 0) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Layout component with Navbar and Sidebar
const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-secondary-50">
      <div className="w-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-6 lg:p-8 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-soft p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      {user && <IdleTimeoutDialog />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <Categories />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/vendors"
            element={
              <ProtectedRoute>
                <Layout>
                  <Vendors />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/forecasting"
            element={
              <ProtectedRoute>
                <Layout>
                  <Forecasting />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/observations"
            element={
              <ProtectedRoute>
                <Layout>
                  <Observations />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 