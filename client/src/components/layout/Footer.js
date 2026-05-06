import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Phone,
  LocationOn,
  Favorite
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeMode } from '../../context/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDark } = useThemeMode();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'AI Allocation System', href: '/simulator' },
        { label: 'Transparency Dashboard', href: '/transparency' },
        { label: 'Patient Portal', href: '/patient' },
        { label: 'Hospital Portal', href: '/hospital' },
      ]
    },
    {
      title: 'Government Integration',
      links: [
        { label: 'ABHA Integration', href: '#' },
        { label: 'Ayushman Bharat', href: '#' },
        { label: 'NOTTO Connectivity', href: '#' },
        { label: 'State Health Departments', href: '#' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Fairness Report', href: '#' },
        { label: 'Research Papers', href: '#' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Emergency Hotline', href: 'tel:+911234567890' },
        { label: 'Technical Support', href: '#' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <GitHub />, href: 'https://github.com/aarogyam', label: 'GitHub' },
    { icon: <LinkedIn />, href: 'https://linkedin.com/company/aarogyam', label: 'LinkedIn' },
    { icon: <Twitter />, href: 'https://twitter.com/aarogyam', label: 'Twitter' },
    { icon: <Email />, href: 'mailto:contact@aarogyam.in', label: 'Email' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        mt: 'auto',
        borderTop: isDark ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
        transition: 'background 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    background: isDark
                      ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  आरोग्यम्
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'grey.300', lineHeight: 1.7 }}>
                  Revolutionizing organ allocation in India through AI-driven fairness, 
                  eliminating gender bias and ensuring equal access to life-saving transplants.
                </Typography>
                
                {/* Contact Info */}
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 18, color: 'grey.400' }} />
                    <Typography variant="body2" color="grey.300">
                      New Delhi, India
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 18, color: 'grey.400' }} />
                    <Typography variant="body2" color="grey.300">
                      +91 1234 567 890
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ fontSize: 18, color: 'grey.400' }} />
                    <Typography variant="body2" color="grey.300">
                      contact@aarogyam.in
                    </Typography>
                  </Box>
                </Stack>

                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social) => (
                    <IconButton
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'grey.400',
                        '&:hover': {
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <Grid item xs={6} sm={3} md={2} key={section.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={1}>
                    {section.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        sx={{
                          color: 'grey.300',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': {
                            color: 'white',
                            textDecoration: 'underline',
                          },
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="grey.400">
            © {currentYear} Aarogyam. All rights reserved. | Privacy Policy | Terms of Service
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="grey.400">
              Made with
            </Typography>
            <Favorite sx={{ fontSize: 16, color: '#ef4444' }} />
            <Typography variant="body2" color="grey.400">
              for a fairer healthcare system in India
            </Typography>
          </Box>
        </Box>

        {/* Impact Stats */}
        <Box
          sx={{
            py: 4,
            background: isDark ? 'rgba(129, 140, 248, 0.05)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            mb: 4,
            textAlign: 'center',
            border: isDark ? '1px solid rgba(129, 140, 248, 0.1)' : 'none',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
            Our Impact Goals
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                50-50
              </Typography>
              <Typography variant="body2" color="grey.300">
                Gender Parity
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                70%
              </Typography>
              <Typography variant="body2" color="grey.300">
                Faster Allocation
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                25%
              </Typography>
              <Typography variant="body2" color="grey.300">
                Higher Success Rate
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                100%
              </Typography>
              <Typography variant="body2" color="grey.300">
                Transparency
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
