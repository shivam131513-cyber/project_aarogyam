import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

// Layout Components
import SimpleNavbar from './components/layout/SimpleNavbar';
import Footer from './components/layout/Footer';

// Enhanced Components
import Chatbot from './components/Chatbot';
import TransparencyDashboardSimple from './components/TransparencyDashboardSimple';

// Page Components (Lazy loaded for better performance)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PatientPortal = React.lazy(() => import('./pages/PatientPortal'));
const HospitalPortal = React.lazy(() => import('./pages/HospitalPortal'));
const TransparencyDashboard = React.lazy(() => import('./pages/TransparencyDashboard'));
const AllocationSimulator = React.lazy(() => import('./pages/AllocationSimulator'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Loading Component
const LoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
    flexDirection="column"
    gap={2}
  >
    <CircularProgress size={60} thickness={4} />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      style={{
        fontSize: '1.2rem',
        fontWeight: 500,
        color: '#667eea',
        textAlign: 'center'
      }}
    >
      Loading Aarogyam System...
    </motion.div>
  </Box>
);

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SimpleNavbar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/transparency" element={<TransparencyDashboardSimple />} />
            <Route path="/transparency-advanced" element={<TransparencyDashboard />} />
            <Route path="/simulator" element={<AllocationSimulator />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patient" element={<PatientPortal />} />
            <Route path="/hospital" element={<HospitalPortal />} />
            <Route path="/hospital-portal" element={<HospitalPortal />} />
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
      
      <Footer />
      
      {/* Global Chatbot */}
      <Chatbot />
    </Box>
  );
}

export default App;
