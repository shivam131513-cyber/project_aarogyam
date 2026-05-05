import React, { useState, useEffect } from 'react';
import './HospitalPortal.css';

// API utility functions using fetch instead of axios to avoid chunk loading errors
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('doctorToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

const HospitalPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [realTimePatients, setRealTimePatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state with demo credentials
  const [loginForm, setLoginForm] = useState({
    email: 'dr.sharma@aiims.edu',
    password: 'Doctor@123'
  });

  // Demo credentials for quick access - SUPER EASY LOGIN
  const demoCredentials = [
    {
      name: 'Dr. Rajesh Sharma (AIIMS)',
      email: 'dr.sharma@aiims.edu',
      password: 'Doctor@123',
      hospital: 'AIIMS New Delhi',
      quickLogin: 'aiims',
      color: '#4CAF50'
    },
    {
      name: 'Dr. Priya Gupta (PGIMER)',
      email: 'dr.priya@pgimer.edu.in',
      password: 'Doctor@123',
      hospital: 'PGIMER Chandigarh',
      quickLogin: 'pgimer',
      color: '#2196F3'
    },
    {
      name: 'System Administrator',
      email: 'admin@aarogyam.gov.in',
      password: 'AarogyamAdmin@2024',
      hospital: 'Aarogyam Central',
      quickLogin: 'admin',
      color: '#FF9800'
    }
  ];

  // Quick login with just password
  const quickLoginPasswords = {
    'aiims': 'dr.sharma@aiims.edu',
    'pgimer': 'dr.priya@pgimer.edu.in', 
    'admin': 'admin@aarogyam.gov.in',
    'doctor': 'dr.sharma@aiims.edu', // Default doctor
    '123': 'dr.sharma@aiims.edu', // Super quick access
    'transparency': 'admin@aarogyam.gov.in' // For transparency access
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    if (token) {
      // Verify token and get user info
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await apiCall('/api/auth/profile');
      setDoctorInfo(response.user);
      setIsAuthenticated(true);
      loadDashboard();
    } catch (error) {
      localStorage.removeItem('doctorToken');
      setIsAuthenticated(false);
    }
  };

  // Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });
      
      if (response.success) {
        localStorage.setItem('doctorToken', response.token);
        setDoctorInfo(response.user);
        setIsAuthenticated(true);
        loadDashboard();
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    setIsAuthenticated(false);
    setDoctorInfo(null);
    setActiveTab('dashboard');
  };

  // Load dashboard data
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashboardResponse, patientsResponse] = await Promise.all([
        apiCall('/api/transparency/dashboard'),
        apiCall('/api/hospital-portal/patients/real-time')
      ]);
      
      setDashboardData(dashboardResponse.data);
      setRealTimePatients(patientsResponse.patients || []);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fill demo credentials
  const fillDemoCredentials = (credentials) => {
    setLoginForm({
      email: credentials.email,
      password: credentials.password
    });
  };

  // Quick login with just a keyword
  const handleQuickLogin = async (quickKey) => {
    const email = quickLoginPasswords[quickKey.toLowerCase()];
    if (email) {
      const password = email.includes('admin') ? 'AarogyamAdmin@2024' : 'Doctor@123';
      
      setLoading(true);
      setError('');

      try {
        const response = await apiCall('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        
        if (response.success) {
          localStorage.setItem('doctorToken', response.token);
          setDoctorInfo(response.user);
          setIsAuthenticated(true);
          loadDashboard();
        }
      } catch (err) {
        setError(err.message || 'Quick login failed');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid quick login code. Try: aiims, pgimer, admin, doctor, 123, or transparency');
    }
  };

  // One-click login
  const oneClickLogin = async (credentials) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      
      if (response.success) {
        localStorage.setItem('doctorToken', response.token);
        setDoctorInfo(response.user);
        setIsAuthenticated(true);
        loadDashboard();
      }
    } catch (err) {
      setError(err.message || 'One-click login failed');
    } finally {
      setLoading(false);
    }
  };

  // Login form component
  const LoginForm = () => (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏥 Aarogyam Hospital Portal</h1>
          <p>Secure Doctor Login</p>
        </div>

        {/* One-Click Login Buttons */}
        <div className="one-click-login">
          <h3>🚀 One-Click Login</h3>
          <div className="one-click-grid">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                className="one-click-btn"
                style={{ backgroundColor: cred.color }}
                onClick={() => oneClickLogin(cred)}
                disabled={loading}
              >
                <div className="btn-icon">
                  {cred.quickLogin === 'admin' ? '👨‍💼' : '👨‍⚕️'}
                </div>
                <div className="btn-text">
                  <div className="btn-name">{cred.name.split(' ')[1]} {cred.name.split(' ')[2]}</div>
                  <div className="btn-hospital">{cred.hospital.split(' ')[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Login with Keywords */}
        <div className="quick-login">
          <h3>⚡ Super Quick Login</h3>
          <p>Type any of these keywords: <code>aiims</code>, <code>pgimer</code>, <code>admin</code>, <code>doctor</code>, <code>123</code>, <code>transparency</code></p>
          <div className="quick-login-form">
            <input
              type="text"
              placeholder="Type quick login code and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleQuickLogin(e.target.value.trim());
                  e.target.value = '';
                }
              }}
              className="quick-input"
            />
          </div>
        </div>

        {/* Demo Credentials Bar */}
        <div className="demo-credentials">
          <h3>🔐 Manual Login (Click to Fill Form)</h3>
          <div className="credentials-grid">
            {demoCredentials.map((cred, index) => (
              <div 
                key={index}
                className="credential-card"
                onClick={() => fillDemoCredentials(cred)}
              >
                <div className="credential-name">{cred.name}</div>
                <div className="credential-hospital">{cred.hospital}</div>
                <div className="credential-email">{cred.email}</div>
                <div className="quick-code">Quick code: <code>{cred.quickLogin}</code></div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>🔒 Secure authentication with JWT tokens</p>
          <p>⏰ Session expires in 8 hours</p>
        </div>
      </div>
    </div>
  );

  // Dashboard component
  const Dashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Hospital Dashboard</h2>
        <div className="doctor-info">
          <span>👨‍⚕️ {doctorInfo?.name}</span>
          <span>🏥 {doctorInfo?.hospitalName}</span>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </div>

      {loading && <div className="loading">🔄 Loading dashboard data...</div>}
      
      {dashboardData && (
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>🏥 Total Hospitals</h3>
              <div className="stat-value">{dashboardData.systemStats?.totalHospitals || 0}</div>
            </div>
            <div className="stat-card">
              <h3>👥 Total Patients</h3>
              <div className="stat-value">{dashboardData.systemStats?.totalPatients || 0}</div>
            </div>
            <div className="stat-card">
              <h3>✅ Success Rate</h3>
              <div className="stat-value">{dashboardData.systemStats?.successRate || 0}%</div>
            </div>
            <div className="stat-card">
              <h3>⏱️ Avg Wait Time</h3>
              <div className="stat-value">{dashboardData.systemStats?.averageWaitTime || 'N/A'}</div>
            </div>
          </div>

          <div className="patients-section">
            <h3>👥 Real-time Patients</h3>
            {realTimePatients.length > 0 ? (
              <div className="patients-grid">
                {realTimePatients.slice(0, 6).map((patient, index) => (
                  <div key={index} className="patient-card">
                    <div className="patient-id">ID: {patient.id || `P${index + 1}`}</div>
                    <div className="patient-organ">Organ: {patient.organNeeded || 'Kidney'}</div>
                    <div className="patient-urgency">
                      Urgency: <span className={`urgency-${patient.urgencyLevel || 'medium'}`}>
                        {patient.urgencyLevel || 'Medium'}
                      </span>
                    </div>
                    <div className="patient-status">Status: {patient.status || 'Active'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-patients">
                <p>📋 No real-time patient data available</p>
                <button onClick={loadDashboard} className="refresh-btn">🔄 Refresh Data</button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="error-section">
          <p>❌ {error}</p>
          <button onClick={loadDashboard} className="retry-btn">🔄 Retry</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="hospital-portal">
      {!isAuthenticated ? <LoginForm /> : <Dashboard />}
    </div>
  );
};

export default HospitalPortal;
