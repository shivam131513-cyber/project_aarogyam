import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Psychology, Balance, Speed, Visibility } from '@mui/icons-material';

const About = () => {
  const features = [
    {
      icon: <Psychology />,
      title: 'AI-Powered Fairness',
      description: 'Advanced algorithms eliminate human bias and ensure fair organ allocation.'
    },
    {
      icon: <Balance />,
      title: 'Gender Equality',
      description: 'Addressing the 80% male recipient vs 75% female donor disparity.'
    },
    {
      icon: <Speed />,
      title: 'Real-Time Matching',
      description: 'Instant organ-patient matching with time-critical optimization.'
    },
    {
      icon: <Visibility />,
      title: 'Complete Transparency',
      description: 'Public dashboard with full audit trails and allocation decisions.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2 }}>
        About Aarogyam
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
        आरोग्यम् (Aarogyam) means "Health & Wellness" in Sanskrit. We're revolutionizing India's organ 
        transplant system through AI-driven fairness and transparency.
      </Typography>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Avatar sx={{ backgroundColor: '#667eea20', color: '#667eea', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                {feature.icon}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ p: 6, background: 'linear-gradient(135deg, #667eea10 0%, #764ba220 100%)' }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
          Our Mission
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          To create a fair, transparent, and efficient organ allocation system that saves more lives 
          by eliminating bias and ensuring equal access to life-saving transplants across India.
        </Typography>
      </Card>
    </Container>
  );
};

export default About;
