import React, { useState, useEffect } from 'react';
import './TransparencyDashboardSimple.css';

const TransparencyDashboardSimple = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // API utility function
  const apiCall = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Fallback demo data
  const fallbackData = {
    systemStats: {
      totalHospitals: 1247,
      activeHospitals: 1189,
      totalPatients: 45678,
      successfulTransplants: 8934,
      successRate: 94.2,
      averageWaitTime: '127 days'
    },
    realTimeMetrics: {
      patientsPresent: 38542,
      patientsAbsent: 7136,
      attendanceRate: 84.4,
      rfidActiveReaders: 3456,
      computerVisionCameras: 2891,
      detectionAccuracy: 96.8
    },
    organAllocation: {
      heart: { available: 23, allocated: 18, inTransit: 5, avgAllocationTime: '4.2 hours' },
      kidney: { available: 67, allocated: 52, inTransit: 15, avgAllocationTime: '18.7 hours' },
      liver: { available: 34, allocated: 28, inTransit: 6, avgAllocationTime: '7.3 hours' }
    },
    regionalStats: [
      { region: 'Delhi NCR', hospitals: 89, patients: 5678, attendanceRate: 87.3, avgResponseTime: '15 mins' },
      { region: 'Mumbai', hospitals: 156, patients: 8934, attendanceRate: 82.1, avgResponseTime: '18 mins' },
      { region: 'Bangalore', hospitals: 134, patients: 7234, attendanceRate: 89.5, avgResponseTime: '12 mins' },
      { region: 'Chennai', hospitals: 98, patients: 5432, attendanceRate: 85.7, avgResponseTime: '16 mins' }
    ],
    recentActivity: [
      {
        timestamp: new Date().toISOString(),
        type: 'allocation',
        message: 'Heart successfully allocated to patient in Rural Maharashtra',
        urgencyScore: 94.2,
        region: 'Maharashtra'
      },
      {
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'detection',
        message: 'Computer vision detected 15 patients in Delhi NCR hospitals',
        confidence: 97.3,
        region: 'Delhi NCR'
      },
      {
        timestamp: new Date(Date.now() - 600000).toISOString(),
        type: 'attendance',
        message: 'RFID system marked 234 patient attendances in last hour',
        accuracy: 99.1,
        region: 'Multiple'
      }
    ],
    equityMetrics: {
      genderDistribution: {
        maleRecipients: 52.3,
        femaleRecipients: 47.7,
        improvement: '+12.7% female recipients vs last year'
      },
      geographicEquity: {
        ruralPatients: 34.2,
        urbanPatients: 65.8,
        ruralSuccessRate: 93.8,
        urbanSuccessRate: 94.5
      },
      economicEquity: {
        publicHospitals: 67.8,
        privateHospitals: 32.2,
        avgWaitTimePublic: '132 days',
        avgWaitTimePrivate: '118 days'
      }
    }
  };

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiCall('/api/transparency/dashboard');
        setDashboardData(response.data);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.warn('API failed, using fallback data:', err);
        setDashboardData(fallbackData);
        setError('Using demo data - Backend server may not be running');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Quick access credentials for transparency
  const adminAccess = {
    email: 'admin@aarogyam.gov.in',
    password: 'AarogyamAdmin@2024',
    quickCode: 'transparency'
  };

  const handleAdminLogin = () => {
    // Redirect to hospital portal with admin credentials
    window.location.href = '/hospital-portal';
    // Store admin credentials for auto-fill
    localStorage.setItem('autoFillCredentials', JSON.stringify(adminAccess));
  };

  if (loading) {
    return (
      <div className="transparency-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>🔄 Loading Transparency Data...</h2>
          <p>Fetching real-time organ allocation statistics</p>
        </div>
      </div>
    );
  }

  // Don't show error screen if we have fallback data
  // if (error && !dashboardData) {
  //   return (
  //     <div className="transparency-dashboard">
  //       <div className="error-container">
  //         <h2>❌ {error}</h2>
  //         <p>Please ensure the backend server is running on port 5000</p>
  //         <button onClick={() => window.location.reload()} className="retry-btn">
  //           🔄 Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="transparency-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏥 Aarogyam Transparency Dashboard</h1>
          <p>Real-time organ allocation transparency and fairness metrics</p>
        </div>
        <div className="header-actions">
          <button onClick={handleAdminLogin} className="admin-login-btn">
            🔐 Admin Access
          </button>
          <div className="connection-status">
            {error ? (
              <div className="status-indicator offline">
                🔴 Demo Mode
                <div className="status-tooltip">Backend server not connected</div>
              </div>
            ) : (
              <div className="status-indicator online">
                🟢 Live Data
                <div className="status-tooltip">Connected to backend server</div>
              </div>
            )}
          </div>
          <div className="last-updated">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Admin Access Info */}
      <div className="admin-access-info">
        <h3>🔐 Admin Access Credentials</h3>
        <div className="credentials-display">
          <div className="credential-item">
            <strong>Email:</strong> <code>admin@aarogyam.gov.in</code>
          </div>
          <div className="credential-item">
            <strong>Password:</strong> <code>AarogyamAdmin@2024</code>
          </div>
          <div className="credential-item">
            <strong>Quick Code:</strong> <code>transparency</code>
          </div>
        </div>
        <p>Use these credentials to access the hospital portal for administrative functions</p>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'hospitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('hospitals')}
        >
          🏥 Hospitals
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📡 Live Activity
        </button>
        <button 
          className={`tab ${activeTab === 'equity' ? 'active' : ''}`}
          onClick={() => setActiveTab('equity')}
        >
          ⚖️ Equity Metrics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏥</div>
                <div className="stat-info">
                  <h3>Total Hospitals</h3>
                  <div className="stat-value">{dashboardData.systemStats?.totalHospitals || 0}</div>
                  <div className="stat-change">+{dashboardData.systemStats?.activeHospitals || 0} active</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Total Patients</h3>
                  <div className="stat-value">{dashboardData.systemStats?.totalPatients || 0}</div>
                  <div className="stat-change">Real-time tracking</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Success Rate</h3>
                  <div className="stat-value">{dashboardData.systemStats?.successRate || 0}%</div>
                  <div className="stat-change">Above target</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <h3>Avg Wait Time</h3>
                  <div className="stat-value">{dashboardData.systemStats?.averageWaitTime || 'N/A'}</div>
                  <div className="stat-change">Decreasing</div>
                </div>
              </div>
            </div>

            {/* Organ Allocation */}
            <div className="organ-allocation">
              <h3>🫀 Real-time Organ Allocation</h3>
              <div className="organ-grid">
                {dashboardData.organAllocation && Object.entries(dashboardData.organAllocation).map(([organ, data]) => (
                  <div key={organ} className="organ-card">
                    <h4>{organ.charAt(0).toUpperCase() + organ.slice(1)}</h4>
                    <div className="organ-stats">
                      <div className="organ-stat">
                        <span className="label">Available:</span>
                        <span className="value">{data.available}</span>
                      </div>
                      <div className="organ-stat">
                        <span className="label">Allocated:</span>
                        <span className="value">{data.allocated}</span>
                      </div>
                      <div className="organ-stat">
                        <span className="label">In Transit:</span>
                        <span className="value">{data.inTransit}</span>
                      </div>
                      <div className="organ-stat">
                        <span className="label">Avg Time:</span>
                        <span className="value">{data.avgAllocationTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hospitals Tab */}
        {activeTab === 'hospitals' && dashboardData && (
          <div className="hospitals-content">
            <h3>🏥 Regional Hospital Statistics</h3>
            <div className="hospitals-grid">
              {dashboardData.regionalStats?.map((region, index) => (
                <div key={index} className="hospital-region-card">
                  <h4>{region.region}</h4>
                  <div className="region-stats">
                    <div className="region-stat">
                      <span className="label">Hospitals:</span>
                      <span className="value">{region.hospitals}</span>
                    </div>
                    <div className="region-stat">
                      <span className="label">Patients:</span>
                      <span className="value">{region.patients}</span>
                    </div>
                    <div className="region-stat">
                      <span className="label">Attendance:</span>
                      <span className="value">{region.attendanceRate}%</span>
                    </div>
                    <div className="region-stat">
                      <span className="label">Response Time:</span>
                      <span className="value">{region.avgResponseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && dashboardData && (
          <div className="activity-content">
            <h3>📡 Recent System Activity</h3>
            <div className="activity-feed">
              {dashboardData.recentActivity?.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'allocation' && '🫀'}
                    {activity.type === 'detection' && '👁️'}
                    {activity.type === 'attendance' && '📋'}
                    {activity.type === 'alert' && '🚨'}
                    {activity.type === 'system' && '⚙️'}
                  </div>
                  <div className="activity-content-text">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-meta">
                      <span className="activity-region">{activity.region}</span>
                      <span className="activity-time">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {activity.urgencyScore && (
                    <div className="activity-score">
                      Score: {activity.urgencyScore}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equity Tab */}
        {activeTab === 'equity' && dashboardData && (
          <div className="equity-content">
            <h3>⚖️ Fairness & Equity Metrics</h3>
            
            {dashboardData.equityMetrics && (
              <div className="equity-sections">
                <div className="equity-section">
                  <h4>👥 Gender Distribution</h4>
                  <div className="equity-stats">
                    <div className="equity-stat">
                      <span className="label">Male Recipients:</span>
                      <span className="value">{dashboardData.equityMetrics.genderDistribution.maleRecipients}%</span>
                    </div>
                    <div className="equity-stat">
                      <span className="label">Female Recipients:</span>
                      <span className="value">{dashboardData.equityMetrics.genderDistribution.femaleRecipients}%</span>
                    </div>
                    <div className="improvement-note">
                      {dashboardData.equityMetrics.genderDistribution.improvement}
                    </div>
                  </div>
                </div>

                <div className="equity-section">
                  <h4>🌍 Geographic Equity</h4>
                  <div className="equity-stats">
                    <div className="equity-stat">
                      <span className="label">Rural Patients:</span>
                      <span className="value">{dashboardData.equityMetrics.geographicEquity.ruralPatients}%</span>
                    </div>
                    <div className="equity-stat">
                      <span className="label">Urban Patients:</span>
                      <span className="value">{dashboardData.equityMetrics.geographicEquity.urbanPatients}%</span>
                    </div>
                    <div className="equity-stat">
                      <span className="label">Rural Success Rate:</span>
                      <span className="value">{dashboardData.equityMetrics.geographicEquity.ruralSuccessRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="equity-section">
                  <h4>💰 Economic Equity</h4>
                  <div className="equity-stats">
                    <div className="equity-stat">
                      <span className="label">Public Hospitals:</span>
                      <span className="value">{dashboardData.equityMetrics.economicEquity.publicHospitals}%</span>
                    </div>
                    <div className="equity-stat">
                      <span className="label">Private Hospitals:</span>
                      <span className="value">{dashboardData.equityMetrics.economicEquity.privateHospitals}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <div className="footer-content">
          <p>🔒 All data is anonymized and aggregated for privacy protection</p>
          <p>📊 Real-time updates every 30 seconds</p>
          <p>🌐 Public transparency dashboard - No login required for viewing</p>
        </div>
      </div>
    </div>
  );
};

export default TransparencyDashboardSimple;
