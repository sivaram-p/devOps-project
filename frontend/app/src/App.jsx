import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';

/** Shows a full-screen spinner while the auth session is being resolved. */
function LoadingScreen() {
  return (
    <div className="loading-screen oil-canvas-bg">
      <div className="loading-box">
        <div className="loading-logo">
          <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#a9d2b6' }}>
            spa
          </span>
        </div>
        <div className="loading-title">Verdant</div>
        <div className="loading-sub">Loading your session...</div>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '22px',
            color: '#a9d2b6',
            animation: 'spin 1.2s linear infinite',
            marginTop: '8px',
          }}
        >
          progress_activity
        </span>
      </div>
    </div>
  );
}

/** Redirects unauthenticated users to /login. */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

/** Redirects already-authenticated users away from auth pages to /dashboard. */
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Default: redirect root to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public auth pages */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterScreen />
              </PublicRoute>
            }
          />

          {/* Protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardScreen />
              </PrivateRoute>
            }
          />

          {/* Catch-all: send unknown paths to /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
