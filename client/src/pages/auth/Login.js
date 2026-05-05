import React, { useState } from 'react';
import { Box, Container, Card, CardContent, TextField, Button, Typography, Link, Divider, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    abhaId: ''
  });
  const [loginType, setLoginType] = useState('email');
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
                Sign in to your account
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Button
                  variant={loginType === 'email' ? 'contained' : 'outlined'}
                  onClick={() => setLoginType('email')}
                  fullWidth
                  size="small"
                >
                  Email Login
                </Button>
                <Button
                  variant={loginType === 'abha' ? 'contained' : 'outlined'}
                  onClick={() => setLoginType('abha')}
                  fullWidth
                  size="small"
                >
                  ABHA Login
                </Button>
              </Box>

              <form onSubmit={handleSubmit}>
                {loginType === 'email' ? (
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    sx={{ mb: 3 }}
                    required
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="ABHA ID"
                    placeholder="12-3456-7890-1234"
                    value={formData.abhaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, abhaId: e.target.value }))}
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
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Typography variant="body2" align="center" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
                  Register here
                </Link>
              </Typography>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Demo Credentials:</strong><br />
                  Email: demo@aarogyam.in<br />
                  Password: demo123<br />
                  ABHA ID: 12-3456-7890-1234
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
