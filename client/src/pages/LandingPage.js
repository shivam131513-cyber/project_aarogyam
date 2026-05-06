import React from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Chip, Stack, Avatar, LinearProgress, useTheme, useMediaQuery
} from '@mui/material';
import {
  Psychology as AIIcon, Balance as FairnessIcon, Speed as SpeedIcon,
  Visibility as TransparencyIcon, Language as LanguageIcon,
  AccountBalance as GovernmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isDark } = useThemeMode();

  const features = [
    { icon: <AIIcon sx={{ fontSize: 40 }} />, title: 'AI-Powered Allocation', description: 'Advanced machine learning algorithm ensures fair organ distribution based on medical urgency, compatibility, and proximity.', color: isDark ? '#818cf8' : '#667eea' },
    { icon: <FairnessIcon sx={{ fontSize: 40 }} />, title: 'Bias Prevention', description: 'Eliminates gender, socioeconomic, and geographic bias through transparent, data-driven allocation decisions.', color: isDark ? '#34d399' : '#10b981' },
    { icon: <SpeedIcon sx={{ fontSize: 40 }} />, title: 'Real-Time Matching', description: 'Instant organ-patient matching with time-critical tracking for heart (4-6h), liver (8-12h), kidney (24-36h).', color: isDark ? '#fbbf24' : '#f59e0b' },
    { icon: <TransparencyIcon sx={{ fontSize: 40 }} />, title: 'Complete Transparency', description: 'Public dashboard showing all allocation decisions with full audit trails and fairness metrics.', color: isDark ? '#a78bfa' : '#8b5cf6' },
    { icon: <GovernmentIcon sx={{ fontSize: 40 }} />, title: 'Government Integration', description: 'Seamless integration with ABHA, Ayushman Bharat, and NOTTO for nationwide coordination.', color: isDark ? '#f87171' : '#ef4444' },
    { icon: <LanguageIcon sx={{ fontSize: 40 }} />, title: 'Multilingual Support', description: 'Available in 15+ Indian languages with voice-based interfaces for better accessibility.', color: isDark ? '#22d3ee' : '#06b6d4' },
  ];

  const stats = [
    { label: 'Gender Parity Target', value: '50-50', color: '#10b981', description: 'Equal allocation regardless of gender' },
    { label: 'Allocation Speed', value: '70%', color: '#3b82f6', description: 'Faster than manual processes' },
    { label: 'Success Rate Increase', value: '25%', color: '#8b5cf6', description: 'Higher transplant success' },
    { label: 'Transparency Score', value: '96%', color: '#f59e0b', description: 'Public audit compliance' },
  ];

  const problemStats = [
    { issue: 'Male Recipients', current: '80%', target: '50%', color: '#ef4444' },
    { issue: 'Female Donors', current: '75%', description: 'Despite being majority donors', color: '#10b981' },
    { issue: 'Urban Advantage', current: '70%', description: 'Better access than rural areas', color: '#f59e0b' },
    { issue: 'Doctor Bias', current: 'High', description: 'Senior recommendations prioritized', color: '#8b5cf6' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: isDark
            ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }, fontWeight: 800, mb: 2, lineHeight: 1.1 }}>
                  आरोग्यम्
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, fontWeight: 600, mb: 3, opacity: 0.95 }}>
                  AI-Powered Fair Organ Allocation
                </Typography>
                <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                  Revolutionizing India's organ transplant system through artificial intelligence, 
                  eliminating gender bias and ensuring equal access to life-saving treatments.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button component={Link} to="/transparency" variant="contained" size="large"
                    sx={{ backgroundColor: 'white', color: isDark ? '#4338ca' : 'primary.main', px: 4, py: 1.5, borderRadius: 3, fontWeight: 600,
                      '&:hover': { backgroundColor: 'grey.100', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                    View Transparency Dashboard
                  </Button>
                  <Button component={Link} to="/simulator" variant="outlined" size="large"
                    sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5, borderRadius: 3, fontWeight: 600,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'white', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                    Try AI Simulator
                  </Button>
                </Stack>
                <Grid container spacing={2}>
                  {[{ val: '50-50', lbl: 'Gender Parity', clr: '#10b981' }, { val: '70%', lbl: 'Faster', clr: '#f59e0b' },
                    { val: '25%', lbl: 'Higher Success', clr: '#3b82f6' }, { val: '15+', lbl: 'Languages', clr: '#8b5cf6' }].map((s) => (
                    <Grid item xs={6} sm={3} key={s.lbl}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: s.clr }}>{s.val}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>{s.lbl}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Box sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 4, p: 4, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>The Problem We're Solving</Typography>
                  <Stack spacing={3}>
                    {problemStats.map((stat, index) => (
                      <motion.div key={stat.issue} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{stat.issue}</Typography>
                          <Chip label={stat.current} sx={{ backgroundColor: stat.color, color: 'white', fontWeight: 600 }} />
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>{stat.description}</Typography>
                        {stat.target && (
                          <LinearProgress variant="determinate" value={75}
                            sx={{ mt: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' } }} />
                        )}
                      </motion.div>
                    ))}
                  </Stack>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <Typography variant="h3" align="center"
            sx={{ fontWeight: 700, mb: 2, background: isDark ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Revolutionary AI Features
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
            Our advanced AI system ensures fair, transparent, and efficient organ allocation across India's healthcare network.
          </Typography>
        </motion.div>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                <Card sx={{ height: '100%', transition: 'all 0.3s ease', backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: isDark ? '0 20px 25px -5px rgba(0,0,0,0.4)' : '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
                  border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0,0,0,0.05)'}` }}>
                  <CardContent sx={{ p: 4 }}>
                    <Avatar sx={{ backgroundColor: `${feature.color}20`, color: feature.color, width: 80, height: 80, mb: 3, mx: 'auto' }}>
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#f1f5f9' : undefined }}>{feature.title}</Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ lineHeight: 1.7 }}>{feature.description}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Algorithm Explanation */}
      <Box sx={{ backgroundColor: isDark ? '#0f172a' : 'grey.50', py: 8, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2, color: isDark ? '#f1f5f9' : undefined }}>AI Allocation Algorithm</Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>Our multi-factor scoring system ensures fair and optimal organ allocation</Typography>
          </motion.div>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <Box sx={{ background: isDark ? 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', p: 4, borderRadius: 4, fontFamily: 'monospace', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Allocation Score Formula:</Typography>
                  <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`Score = Medical Urgency (40%) +
        Organ Compatibility (30%) +
        Geographic Proximity (20%) +
        Wait Time (10%)

Bias Prevention:
✓ Gender neutrality enforced
✓ Economic status excluded
✓ Doctor recommendations standardized
✓ Rural adjustment factor applied`}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                <Stack spacing={3}>
                  {[{ title: 'Medical Urgency (40%)', desc: 'Critical condition, organ failure stage, survival probability, age considerations', clr: isDark ? '#818cf8' : '#667eea' },
                    { title: 'Compatibility (30%)', desc: 'Blood type, HLA matching, organ size, cross-match results', clr: isDark ? '#34d399' : '#10b981' },
                    { title: 'Proximity (20%)', desc: 'Travel time vs organ viability window, transport logistics', clr: isDark ? '#fbbf24' : '#f59e0b' },
                    { title: 'Wait Time (10%)', desc: 'Time on waiting list, registration date priority', clr: isDark ? '#a78bfa' : '#8b5cf6' }].map((item) => (
                    <Card key={item.title} sx={{ p: 3, border: `2px solid ${item.clr}`, backgroundColor: isDark ? '#1e293b' : '#ffffff' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: item.clr, mb: 1 }}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                    </Card>
                  ))}
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Impact Stats */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6, color: isDark ? '#f1f5f9' : undefined }}>Expected Impact</Typography>
        </motion.div>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                <Card sx={{ textAlign: 'center', p: 4, height: '100%',
                  background: isDark ? `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)` : `linear-gradient(135deg, ${stat.color}10 0%, ${stat.color}20 100%)`,
                  border: `2px solid ${stat.color}${isDark ? '40' : '30'}`, transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 10px 25px ${stat.color}30` } }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: stat.color, mb: 1 }}>{stat.value}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#f1f5f9' : undefined }}>{stat.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.description}</Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ background: isDark ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white', py: 8, borderTop: isDark ? '1px solid rgba(148, 163, 184, 0.1)' : 'none' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 3 }}>Join the Revolution</Typography>
            <Typography variant="h6" align="center" sx={{ mb: 4, opacity: 0.9 }}>
              Be part of India's transformation towards fair and transparent organ allocation. 
              Together, we can save more lives and ensure equal access to healthcare.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button component={Link} to="/register" variant="contained" size="large"
                sx={{ background: isDark ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)' : '#667eea', px: 4, py: 1.5, borderRadius: 3, fontWeight: 600,
                  '&:hover': { opacity: 0.9, transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                Register as Patient
              </Button>
              <Button component={Link} to="/hospital" variant="outlined" size="large"
                sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5, borderRadius: 3, fontWeight: 600,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'white', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                Hospital Integration
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
