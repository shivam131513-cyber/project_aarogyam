import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';

const SimpleNavbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            mr: 2
          }}
        >
          आरोग्यम्
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={Link}
            to="/"
            sx={{ color: 'text.primary' }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/transparency"
            sx={{ color: 'text.primary' }}
          >
            Transparency
          </Button>
          <Button
            component={Link}
            to="/simulator"
            sx={{ color: 'text.primary' }}
          >
            AI Simulator
          </Button>
          <Button
            component={Link}
            to="/patient"
            sx={{ color: 'text.primary' }}
          >
            Patient Portal
          </Button>
          <Button
            component={Link}
            to="/hospital"
            sx={{ color: 'text.primary' }}
          >
            Hospital Portal
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="small"
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleNavbar;
