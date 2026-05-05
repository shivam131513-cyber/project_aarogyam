import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Chip, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

const AllocationSimulator = () => {
  const [organType, setOrganType] = useState('kidney');
  const [results, setResults] = useState(null);

  const runSimulation = () => {
    // Mock simulation results
    setResults({
      selectedPatient: {
        id: 'P001',
        name: 'Patient A',
        gender: 'Female',
        age: 45,
        location: 'Rural Maharashtra',
        finalScore: 86.2
      },
      breakdown: {
        medicalUrgency: 85,
        compatibility: 92,
        proximity: 78,
        waitTime: 65
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        AI Allocation Simulator
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Configure Simulation</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Organ Type</InputLabel>
              <Select value={organType} onChange={(e) => setOrganType(e.target.value)}>
                <MenuItem value="kidney">Kidney</MenuItem>
                <MenuItem value="liver">Liver</MenuItem>
                <MenuItem value="heart">Heart</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={runSimulation} fullWidth>
              Run AI Simulation
            </Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Selected Patient</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {results.selectedPatient.name} - {results.selectedPatient.gender}, {results.selectedPatient.age}y
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {results.selectedPatient.location}
                </Typography>
                <Chip label={`Final Score: ${results.selectedPatient.finalScore}`} color="primary" />
                
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Score Breakdown</Typography>
                {Object.entries(results.breakdown).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}%
                    </Typography>
                    <LinearProgress variant="determinate" value={value} />
                  </Box>
                ))}
              </Card>
            </motion.div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllocationSimulator;
