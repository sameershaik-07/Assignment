import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import PlatformIdModal from './components/PlatformIdModal';
import ItemDashboard from './components/ItemDashboard';
import { getMe } from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [user, setUser] = useState(null);
  const [newlyRegisteredUser, setNewlyRegisteredUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Check stored token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
          setInitializing(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setInitializing(false);
        });
    } else {
      setInitializing(false);
    }
  }, []);

  const handleRegisterSuccess = (registeredUser) => {
    setNewlyRegisteredUser(registeredUser);
  };

  const handleCloseModal = () => {
    setNewlyRegisteredUser(null);
    setActiveTab('login');
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('login');
  };

  if (initializing) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Initializing application...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <main className="app-container">
        {user ? (
          <ItemDashboard user={user} />
        ) : (
          <>
            <div className="hero-section">
              <h1>DevOps Full-Stack Platform</h1>
              <p>PostgreSQL Integration • Unique Platform ID Generation • Automated CI/CD</p>
            </div>

            <div className="auth-wrapper">
              <div className="auth-tabs glassmorphism">
                <button
                  className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  Create Account
                </button>
                <button
                  className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Log In
                </button>
              </div>

              {activeTab === 'register' ? (
                <RegisterForm onSuccess={handleRegisterSuccess} />
              ) : (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              )}
            </div>
          </>
        )}
      </main>

      {/* Platform ID Modal upon successful registration */}
      {newlyRegisteredUser && (
        <PlatformIdModal user={newlyRegisteredUser} onClose={handleCloseModal} />
      )}

      <footer className="app-footer glassmorphism">
        <p>Full Stack Application Deployment & DevOps Assignment • Railway + GitHub Actions</p>
      </footer>
    </>
  );
}
