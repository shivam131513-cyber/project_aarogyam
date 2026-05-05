import React, { useState } from 'react';
import { Box, Container, Card, CardContent, TextField, Button, Typography, Link, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'patient',
    abhaId: '',
    hospitalName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            <CardContent>
              <Typography
                variant="h4"
                align="center"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                आरोग्यम्
              </Typography>
              <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Create your account
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  sx={{ mb: 3 }}
                  required
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={formData.userType}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
                  >
                    <MenuItem value="patient">Patient</MenuItem>
                    <MenuItem value="hospital">Hospital</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
                </FormControl>

                {formData.userType === 'patient' && (
                  <TextField
                    fullWidth
                    label="ABHA ID (Optional)"
                    placeholder="12-3456-7890-1234"
                    value={formData.abhaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, abhaId: e.target.value }))}
                    sx={{ mb: 3 }}
                  />
                )}

                {formData.userType === 'hospital' && (
                  <TextField
                    fullWidth
                    label="Hospital Name"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
                    sx={{ mb: 3 }}
                    required
                  />
                )}

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  sx={{ mb: 3 }}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
                  Sign in here
                </Link>
              </Typography>

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  Join India's most advanced organ allocation system with AI-powered fairness and transparency.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
