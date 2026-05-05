import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Contact = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6 }}>
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Email sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Email</Typography>
            <Typography color="text.secondary">contact@aarogyam.in</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Phone sx={{ fontSize: 40, color: '#10b981', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Phone</Typography>
            <Typography color="text.secondary">+91 1234 567 890</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <LocationOn sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Address</Typography>
            <Typography color="text.secondary">New Delhi, India</Typography>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Send us a message</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" type="email" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Subject" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={4} label="Message" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" size="large">Send Message</Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Contact;
