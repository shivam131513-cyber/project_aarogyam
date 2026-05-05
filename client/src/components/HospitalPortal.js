import React, { useState, useEffect } from 'react';
import './HospitalPortal.css';

// API utility functions using fetch instead of axios to avoid chunk loading errors
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
  const [regionalPatients, setRegionalPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    hospitalId: '',
    doctorId: ''
  });

  // Filters
  const [filters, setFilters] = useState({
    organType: '',
    urgencyLevel: '',
    region: '',
    radius: ''
  });

  // RFID form state
  const [rfidForm, setRFIDForm] = useState({
    rfidTag: '',
    location: ''
  });

  // Manual attendance form
  const [manualForm, setManualForm] = useState({
    patientId: '',
    status: 'present',
    location: '',
    notes: ''
  });

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/hospital-portal/doctor/login`, loginForm);
      
      if (response.data.success) {
        localStorage.setItem('doctorToken', response.data.token);
        setDoctorInfo(response.data.doctor);
        setIsAuthenticated(true);
        loadDashboard();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
    try {
      const token = localStorage.getItem('doctorToken');
      const response = await axios.get(`${API_BASE}/hospital-portal/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  // Load real-time patients
  const loadRealTimePatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('doctorToken');
      const params = new URLSearchParams();
      
      if (filters.organType) params.append('organType', filters.organType);
      if (filters.urgencyLevel) params.append('urgencyLevel', filters.urgencyLevel);
      if (filters.region) params.append('region', filters.region);

      const response = await axios.get(`${API_BASE}/hospital-portal/patients/real-time?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setRealTimePatients(response.data.patients);
      }
    } catch (err) {
      setError('Failed to load real-time patients');
    } finally {
      setLoading(false);
    }
  };

  // Load regional patients
  const loadRegionalPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('doctorToken');
      const params = new URLSearchParams();
      
      if (filters.region) params.append('region', filters.region);
      if (filters.radius) params.append('radius', filters.radius);
      if (filters.organType) params.append('organType', filters.organType);

      const response = await axios.get(`${API_BASE}/hospital-portal/patients/regional?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setRegionalPatients(response.data.patients);
      }
    } catch (err) {
      setError('Failed to load regional patients');
    } finally {
      setLoading(false);
    }
  };

  // RFID attendance
  const handleRFIDAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('doctorToken');
      const response = await axios.post(`${API_BASE}/hospital-portal/attendance/rfid`, rfidForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('RFID attendance marked successfully!');
        setRFIDForm({ rfidTag: '', location: '' });
        loadRealTimePatients(); // Refresh patient data
      }
    } catch (err) {
      setError(err.response?.data?.message || 'RFID attendance failed');
    } finally {
      setLoading(false);
    }
  };

  // Manual attendance
  const handleManualAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('doctorToken');
      const response = await axios.post(`${API_BASE}/hospital-portal/attendance/manual`, manualForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Manual attendance recorded successfully!');
        setManualForm({ patientId: '', status: 'present', location: '', notes: '' });
        loadRealTimePatients(); // Refresh patient data
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Manual attendance failed');
    } finally {
      setLoading(false);
    }
  };

  // Computer vision detection
  const triggerVisionDetection = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('doctorToken');
      const response = await axios.post(`${API_BASE}/hospital-portal/vision/detect`, {
        cameraId: 'CAM_001',
        imageData: 'mock_image_data'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(`Computer Vision: ${response.data.message}`);
        loadRealTimePatients(); // Refresh patient data
      }
    } catch (err) {
      setError('Computer vision detection failed');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    if (token) {
      // Verify token and load doctor info
      setIsAuthenticated(true);
      loadDashboard();
    }
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (isAuthenticated) {
      switch (activeTab) {
        case 'realtime':
          loadRealTimePatients();
          break;
        case 'regional':
          loadRegionalPatients();
          break;
        default:
          break;
      }
    }
  }, [activeTab, filters]);

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="hospital-portal">
        <div className="login-container">
          <div className="login-card">
            <h2>🏥 Hospital Portal Login</h2>
            <p>Doctor Access - Aarogyam System</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Hospital ID:</label>
                <input
                  type="text"
                  value={loginForm.hospitalId}
                  onChange={(e) => setLoginForm({...loginForm, hospitalId: e.target.value})}
                  placeholder="e.g., HOSP_001"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Doctor ID:</label>
                <input
                  type="text"
                  value={loginForm.doctorId}
                  onChange={(e) => setLoginForm({...loginForm, doctorId: e.target.value})}
                  placeholder="e.g., DOC_001"
                  required
                />
              </div>
              
              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="hospital-portal">
      {/* Header */}
      <header className="portal-header">
        <div className="header-left">
          <h1>🏥 Hospital Portal</h1>
          <span className="hospital-name">{doctorInfo?.hospitalId}</span>
        </div>
        <div className="header-right">
          <div className="doctor-info">
            <span className="doctor-name">Dr. {doctorInfo?.name}</span>
            <span className="doctor-dept">{doctorInfo?.department}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="portal-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'realtime' ? 'active' : ''} 
          onClick={() => setActiveTab('realtime')}
        >
          🔴 Real-time Patients
        </button>
        <button 
          className={activeTab === 'regional' ? 'active' : ''} 
          onClick={() => setActiveTab('regional')}
        >
          🗺️ Regional Patients
        </button>
        <button 
          className={activeTab === 'attendance' ? 'active' : ''} 
          onClick={() => setActiveTab('attendance')}
        >
          📋 Attendance
        </button>
        <button 
          className={activeTab === 'vision' ? 'active' : ''} 
          onClick={() => setActiveTab('vision')}
        >
          👁️ Computer Vision
        </button>
      </nav>

      {/* Content Area */}
      <main className="portal-content">
        {error && <div className="error-message">{error}</div>}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="dashboard-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <div className="stat-number">{dashboardData.patientStats.totalPatients}</div>
              </div>
              <div className="stat-card">
                <h3>Present</h3>
                <div className="stat-number present">{dashboardData.patientStats.presentPatients}</div>
              </div>
              <div className="stat-card">
                <h3>Absent</h3>
                <div className="stat-number absent">{dashboardData.patientStats.absentPatients}</div>
              </div>
              <div className="stat-card">
                <h3>Critical</h3>
                <div className="stat-number critical">{dashboardData.patientStats.criticalPatients}</div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="section">
                <h3>Organ Requests</h3>
                <div className="organ-stats">
                  <div className="organ-item">Heart: {dashboardData.organRequests.heart}</div>
                  <div className="organ-item">Kidney: {dashboardData.organRequests.kidney}</div>
                  <div className="organ-item">Liver: {dashboardData.organRequests.liver}</div>
                </div>
              </div>

              <div className="section">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-time">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="activity-message">{activity.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Patients Tab */}
        {activeTab === 'realtime' && (
          <div className="realtime-tab">
            <div className="filters-section">
              <h3>Filters</h3>
              <div className="filters-grid">
                <select 
                  value={filters.organType} 
                  onChange={(e) => setFilters({...filters, organType: e.target.value})}
                >
                  <option value="">All Organs</option>
                  <option value="heart">Heart</option>
                  <option value="kidney">Kidney</option>
                  <option value="liver">Liver</option>
                </select>
                
                <select 
                  value={filters.urgencyLevel} 
                  onChange={(e) => setFilters({...filters, urgencyLevel: e.target.value})}
                >
                  <option value="">All Urgency</option>
                  <option value="critical">Critical (90+)</option>
                  <option value="high">High (80+)</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Region"
                  value={filters.region}
                  onChange={(e) => setFilters({...filters, region: e.target.value})}
                />
              </div>
            </div>

            <div className="patients-grid">
              {realTimePatients.map((patient) => (
                <div key={patient.id} className={`patient-card ${patient.isPresent ? 'present' : 'absent'}`}>
                  <div className="patient-header">
                    <h4>{patient.name}</h4>
                    <span className={`status-badge ${patient.attendanceStatus}`}>
                      {patient.isPresent ? '🟢 Present' : '🔴 Absent'}
                    </span>
                  </div>
                  
                  <div className="patient-details">
                    <p><strong>ABHA ID:</strong> {patient.abhaId}</p>
                    <p><strong>Organ Needed:</strong> {patient.organNeeded}</p>
                    <p><strong>Urgency Score:</strong> {patient.urgencyScore}/100</p>
                    <p><strong>Location:</strong> {patient.location}</p>
                    <p><strong>Last Seen:</strong> {new Date(patient.lastSeen).toLocaleString()}</p>
                    
                    {patient.vitalSigns && (
                      <div className="vital-signs">
                        <p><strong>Heart Rate:</strong> {patient.vitalSigns.heartRate} bpm</p>
                        <p><strong>BP:</strong> {patient.vitalSigns.bloodPressure}</p>
                        <p><strong>O2 Sat:</strong> {patient.vitalSigns.oxygenSaturation}%</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="patient-contact">
                    <p><strong>Phone:</strong> {patient.contactInfo.phone}</p>
                    <p><strong>Emergency:</strong> {patient.contactInfo.emergencyContact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regional Patients Tab */}
        {activeTab === 'regional' && (
          <div className="regional-tab">
            <div className="filters-section">
              <h3>Regional Search</h3>
              <div className="filters-grid">
                <input
                  type="text"
                  placeholder="Region (e.g., Delhi NCR)"
                  value={filters.region}
                  onChange={(e) => setFilters({...filters, region: e.target.value})}
                />
                
                <input
                  type="number"
                  placeholder="Radius (km)"
                  value={filters.radius}
                  onChange={(e) => setFilters({...filters, radius: e.target.value})}
                />
                
                <select 
                  value={filters.organType} 
                  onChange={(e) => setFilters({...filters, organType: e.target.value})}
                >
                  <option value="">All Organs</option>
                  <option value="heart">Heart</option>
                  <option value="kidney">Kidney</option>
                  <option value="liver">Liver</option>
                </select>
              </div>
            </div>

            <div className="regional-patients-grid">
              {regionalPatients.map((patient) => (
                <div key={patient.id} className={`regional-patient-card ${patient.isAvailable ? 'available' : 'unavailable'}`}>
                  <div className="patient-header">
                    <h4>{patient.name}</h4>
                    <span className={`availability-badge ${patient.isAvailable ? 'available' : 'unavailable'}`}>
                      {patient.isAvailable ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>
                  
                  <div className="patient-details">
                    <p><strong>Organ Needed:</strong> {patient.organNeeded}</p>
                    <p><strong>Urgency Score:</strong> {patient.urgencyScore}/100</p>
                    <p><strong>Hospital:</strong> {patient.contactHospital}</p>
                    <p><strong>Distance:</strong> {patient.distance}</p>
                    <p><strong>Travel Time:</strong> {patient.estimatedTravelTime}</p>
                    
                    {!patient.isAvailable && patient.unavailableReason && (
                      <p><strong>Reason:</strong> {patient.unavailableReason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="attendance-tab">
            <div className="attendance-sections">
              {/* RFID Attendance */}
              <div className="section">
                <h3>🏷️ RFID Attendance</h3>
                <form onSubmit={handleRFIDAttendance}>
                  <div className="form-group">
                    <label>RFID Tag:</label>
                    <input
                      type="text"
                      value={rfidForm.rfidTag}
                      onChange={(e) => setRFIDForm({...rfidForm, rfidTag: e.target.value})}
                      placeholder="e.g., RFID001"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Location:</label>
                    <input
                      type="text"
                      value={rfidForm.location}
                      onChange={(e) => setRFIDForm({...rfidForm, location: e.target.value})}
                      placeholder="e.g., Ward 3A"
                      required
                    />
                  </div>
                  
                  <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Mark RFID Attendance'}
                  </button>
                </form>
              </div>

              {/* Manual Attendance */}
              <div className="section">
                <h3>✋ Manual Attendance</h3>
                <form onSubmit={handleManualAttendance}>
                  <div className="form-group">
                    <label>Patient ID:</label>
                    <input
                      type="text"
                      value={manualForm.patientId}
                      onChange={(e) => setManualForm({...manualForm, patientId: e.target.value})}
                      placeholder="e.g., P001"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={manualForm.status}
                      onChange={(e) => setManualForm({...manualForm, status: e.target.value})}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Location:</label>
                    <input
                      type="text"
                      value={manualForm.location}
                      onChange={(e) => setManualForm({...manualForm, location: e.target.value})}
                      placeholder="e.g., Ward 3A"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Notes:</label>
                    <textarea
                      value={manualForm.notes}
                      onChange={(e) => setManualForm({...manualForm, notes: e.target.value})}
                      placeholder="Additional notes..."
                      rows="3"
                    />
                  </div>
                  
                  <button type="submit" disabled={loading}>
                    {loading ? 'Recording...' : 'Record Manual Attendance'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Computer Vision Tab */}
        {activeTab === 'vision' && (
          <div className="vision-tab">
            <div className="section">
              <h3>👁️ Computer Vision Detection</h3>
              <p>Automatically detect patients using camera feeds and AI.</p>
              
              <div className="vision-controls">
                <button 
                  onClick={triggerVisionDetection} 
                  disabled={loading}
                  className="vision-btn"
                >
                  {loading ? 'Detecting...' : '🔍 Trigger Detection'}
                </button>
              </div>
              
              <div className="vision-info">
                <h4>Camera Network Status</h4>
                <div className="camera-grid">
                  <div className="camera-item">
                    <span className="camera-name">Ward 3A Camera</span>
                    <span className="camera-status online">🟢 Online</span>
                  </div>
                  <div className="camera-item">
                    <span className="camera-name">ICU Camera</span>
                    <span className="camera-status online">🟢 Online</span>
                  </div>
                  <div className="camera-item">
                    <span className="camera-name">Cafeteria Camera</span>
                    <span className="camera-status offline">🔴 Offline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalPortal;
