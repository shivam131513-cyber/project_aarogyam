import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Dashboard as DashboardIcon, TrendingUp, People, LocalHospital } from '@mui/icons-material';

const Dashboard = () => {
  const stats = [
    { title: 'Active Patients', value: '1,247', icon: <People />, color: '#667eea' },
    { title: 'Hospitals Connected', value: '89', icon: <LocalHospital />, color: '#10b981' },
    { title: 'Successful Allocations', value: '156', icon: <TrendingUp />, color: '#f59e0b' },
    { title: 'Fairness Score', value: '96%', icon: <DashboardIcon />, color: '#8b5cf6' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
        System Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ backgroundColor: `${stat.color}20`, color: stat.color, mx: 'auto', mb: 2 }}>
                {stat.icon}
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {stat.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Card sx={{ mt: 4, p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Recent Activity</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Kidney allocated to Patient P***45</Typography>
            <Chip label="2 hours ago" size="small" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>New hospital registered: AIIMS Delhi</Typography>
            <Chip label="5 hours ago" size="small" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Liver allocation completed successfully</Typography>
            <Chip label="1 day ago" size="small" />
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default Dashboard;
