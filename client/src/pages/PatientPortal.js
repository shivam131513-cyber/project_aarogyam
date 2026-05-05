import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Grid, TextField, Stepper, Step, StepLabel, Alert } from '@mui/material';
import { Person, MedicalServices, Schedule } from '@mui/icons-material';

const PatientPortal = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodType: '',
    organNeeded: '',
    medicalHistory: ''
  });

  const steps = ['Personal Info', 'Medical Details', 'Registration Complete'];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Patient Registration Portal
      </Typography>
      
      <Card sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Personal Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ABHA ID (Optional)"
                  placeholder="12-3456-7890-1234"
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleNext} sx={{ mt: 3 }}>
              Next
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Medical Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blood Type"
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Organ Needed"
                  value={formData.organNeeded}
                  onChange={(e) => handleInputChange('organNeeded', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Medical History"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleNext} sx={{ mt: 3 }}>
              Complete Registration
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Registration completed successfully! You have been added to the waiting list.
            </Alert>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Registration ID: PT-2024-001
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our AI system will continuously monitor for compatible organs and notify you immediately when a match is found.
            </Typography>
          </Box>
        )}
      </Card>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Person sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Fair Allocation</Typography>
            <Typography variant="body2" color="text.secondary">
              AI ensures unbiased organ allocation based on medical need
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <MedicalServices sx={{ fontSize: 40, color: '#10b981', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Medical Priority</Typography>
            <Typography variant="body2" color="text.secondary">
              Your medical urgency is continuously monitored and updated
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Schedule sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Real-time Updates</Typography>
            <Typography variant="body2" color="text.secondary">
              Get instant notifications when a compatible organ is available
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientPortal;
