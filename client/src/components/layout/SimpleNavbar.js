import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Transparency', path: '/transparency' },
  { label: 'AI Simulator', path: '/simulator' },
  { label: 'Patient Portal', path: '/patient' },
  { label: 'Hospital Portal', path: '/hospital' },
];

const SimpleNavbar = () => {
  const { mode, toggleTheme, isDark } = useThemeMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: isDark
            ? 'rgba(15, 23, 42, 0.9)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          color: isDark ? '#f1f5f9' : 'text.primary',
          transition: 'all 0.3s ease',
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
              background: isDark
                ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
              mr: 2,
            }}
          >
            आरोग्यम्
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: isDark ? '#e2e8f0' : 'text.primary',
                    fontWeight: isActive(link.path) ? 600 : 400,
                    position: 'relative',
                    '&::after': isActive(link.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: 3,
                      borderRadius: 2,
                      background: isDark
                        ? 'linear-gradient(90deg, #818cf8, #a78bfa)'
                        : 'linear-gradient(90deg, #667eea, #764ba2)',
                    } : {},
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(129, 140, 248, 0.08)' : 'rgba(102, 126, 234, 0.08)',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {/* Theme Toggle */}
              <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    ml: 1,
                    color: isDark ? '#fbbf24' : '#6366f1',
                    backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      transform: 'rotate(30deg)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isDark ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>

              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
                sx={{
                  ml: 1.5,
                  borderColor: isDark ? '#818cf8' : undefined,
                  color: isDark ? '#818cf8' : undefined,
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Register
              </Button>
            </Box>
          )}

          {/* Mobile: Theme Toggle + Hamburger */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={toggleTheme}
                sx={{ color: isDark ? '#fbbf24' : '#6366f1' }}
              >
                {isDark ? <LightMode /> : <DarkMode />}
              </IconButton>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ color: isDark ? '#e2e8f0' : 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f1f5f9' : 'text.primary',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: isDark
                ? 'linear-gradient(135deg, #818cf8, #a78bfa)'
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            आरोग्यम्
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: isDark ? '#94a3b8' : undefined }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                component={Link}
                to={link.path}
                onClick={handleDrawerToggle}
                selected={isActive(link.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(102, 126, 234, 0.08)',
                    borderRight: `3px solid ${isDark ? '#818cf8' : '#667eea'}`,
                  },
                }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/register" onClick={handleDrawerToggle}>
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default SimpleNavbar;
