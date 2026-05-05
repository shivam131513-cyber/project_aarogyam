import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Balance,
  Speed,
  Visibility,
  Download,
  Refresh,
  FilterList,
  Male,
  Female,
  LocationCity,
  LocationOn
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const TransparencyDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for transparency metrics
  const fairnessMetrics = {
    genderParity: {
      current: 0.48, // 48% female recipients (improving from 20%)
      target: 0.50,
      trend: '+28%',
      status: 'improving'
    },
    geographicFairness: {
      current: 0.38, // 38% rural recipients
      target: 0.40,
      trend: '+18%',
      status: 'improving'
    },
    allocationSpeed: {
      current: 2.3, // hours
      target: 2.0,
      trend: '-70%',
      status: 'excellent'
    },
    transparencyScore: {
      current: 0.96,
      target: 0.95,
      trend: '+6%',
      status: 'excellent'
    }
  };

  const recentAllocations = [
    {
      id: 'AL001',
      organ: 'Kidney',
      patientId: 'P***45',
      gender: 'Female',
      age: 42,
      location: 'Rural Maharashtra',
      urgencyScore: 85,
      compatibilityScore: 92,
      proximityScore: 78,
      waitTime: 245,
      finalScore: 86.2,
      timestamp: '2024-01-15 14:30',
      reason: 'High medical urgency with excellent compatibility'
    },
    {
      id: 'AL002',
      organ: 'Liver',
      patientId: 'P***78',
      gender: 'Male',
      age: 38,
      location: 'Urban Delhi',
      urgencyScore: 92,
      compatibilityScore: 88,
      proximityScore: 95,
      waitTime: 180,
      finalScore: 90.1,
      timestamp: '2024-01-15 12:15',
      reason: 'Critical condition requiring immediate intervention'
    },
    {
      id: 'AL003',
      organ: 'Heart',
      patientId: 'P***23',
      gender: 'Female',
      age: 29,
      location: 'Rural Tamil Nadu',
      urgencyScore: 95,
      compatibilityScore: 85,
      proximityScore: 72,
      waitTime: 320,
      finalScore: 87.8,
      timestamp: '2024-01-15 09:45',
      reason: 'Critical cardiac condition with good compatibility'
    }
  ];

  const genderTrendData = [
    { month: 'Jul', male: 78, female: 22 },
    { month: 'Aug', male: 75, female: 25 },
    { month: 'Sep', male: 72, female: 28 },
    { month: 'Oct', male: 68, female: 32 },
    { month: 'Nov', male: 62, female: 38 },
    { month: 'Dec', male: 58, female: 42 },
    { month: 'Jan', male: 52, female: 48 }
  ];

  const organDistribution = [
    { name: 'Kidney', value: 156, color: '#667eea' },
    { name: 'Liver', value: 89, color: '#10b981' },
    { name: 'Heart', value: 45, color: '#f59e0b' },
    { name: 'Lung', value: 23, color: '#8b5cf6' },
    { name: 'Pancreas', value: 12, color: '#ef4444' },
    { name: 'Cornea', value: 8, color: '#06b6d4' }
  ];

  const biasMetrics = [
    { category: 'Gender Bias', before: 0.8, after: 0.02, improvement: 97.5 },
    { category: 'Economic Bias', before: 0.65, after: 0.0, improvement: 100 },
    { category: 'Geographic Bias', before: 0.7, after: 0.18, improvement: 74.3 },
    { category: 'Doctor Hierarchy', before: 0.85, after: 0.05, improvement: 94.1 }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'improving': return '#f59e0b';
      case 'needs-attention': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const MetricCard = ({ title, value, target, trend, status, icon, unit = '' }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: getStatusColor(status) }}>
              {value}{unit}
            </Typography>
          </Box>
          <Avatar sx={{ backgroundColor: `${getStatusColor(status)}20`, color: getStatusColor(status) }}>
            {icon}
          </Avatar>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Target: {target}{unit}
          </Typography>
          <Chip
            label={trend}
            size="small"
            sx={{
              backgroundColor: status === 'excellent' || status === 'improving' ? '#10b98120' : '#ef444420',
              color: status === 'excellent' || status === 'improving' ? '#10b981' : '#ef4444',
              fontWeight: 600
            }}
          />
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={Math.min((value / target) * 100, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getStatusColor(status),
              borderRadius: 4
            }
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Transparency Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Real-time fairness metrics and allocation transparency
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={timeFilter}
                  label="Time Period"
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <MenuItem value="7d">Last 7 days</MenuItem>
                  <MenuItem value="30d">Last 30 days</MenuItem>
                  <MenuItem value="90d">Last 90 days</MenuItem>
                  <MenuItem value="1y">Last year</MenuItem>
                </Select>
              </FormControl>
              
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} disabled={refreshing}>
                  <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Download Report">
                <IconButton>
                  <Download />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Gender Parity"
                value={48}
                target={50}
                trend="+28%"
                status="improving"
                icon={<Balance />}
                unit="%"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Rural Access"
                value={38}
                target={40}
                trend="+18%"
                status="improving"
                icon={<LocationOn />}
                unit="%"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Avg Allocation Time"
                value={2.3}
                target={2.0}
                trend="-70%"
                status="excellent"
                icon={<Speed />}
                unit="h"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Transparency Score"
                value={96}
                target={95}
                trend="+6%"
                status="excellent"
                icon={<Visibility />}
                unit="%"
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Fairness Trends" />
                <Tab label="Recent Allocations" />
                <Tab label="Bias Elimination" />
                <Tab label="Organ Distribution" />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Fairness Trends Tab */}
              {tabValue === 0 && (
                <Grid container spacing={4}>
                  <Grid item xs={12} lg={8}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Gender Parity Progress
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={genderTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="male"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          name="Male Recipients (%)"
                        />
                        <Line
                          type="monotone"
                          dataKey="female"
                          stroke="#ef4444"
                          strokeWidth={3}
                          name="Female Recipients (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Grid>
                  
                  <Grid item xs={12} lg={4}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Key Improvements
                    </Typography>
                    <Stack spacing={3}>
                      <Card sx={{ p: 3, backgroundColor: '#10b98110', border: '1px solid #10b98130' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                          +28%
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                          Female Recipients
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Increased from 20% to 48% in 6 months
                        </Typography>
                      </Card>
                      
                      <Card sx={{ p: 3, backgroundColor: '#3b82f610', border: '1px solid #3b82f630' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1 }}>
                          +18%
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                          Rural Access
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Better representation vs national average
                        </Typography>
                      </Card>
                      
                      <Card sx={{ p: 3, backgroundColor: '#8b5cf610', border: '1px solid #8b5cf630' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6', mb: 1 }}>
                          94%
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                          Success Rate
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Higher than manual allocation
                        </Typography>
                      </Card>
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {/* Recent Allocations Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Recent AI Allocation Decisions
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Allocation ID</TableCell>
                          <TableCell>Organ</TableCell>
                          <TableCell>Patient</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Final Score</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell>Timestamp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentAllocations.map((allocation) => (
                          <TableRow key={allocation.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                {allocation.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={allocation.organ}
                                size="small"
                                sx={{ backgroundColor: '#667eea20', color: '#667eea' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {allocation.gender === 'Female' ? 
                                  <Female sx={{ color: '#ef4444', fontSize: 18 }} /> : 
                                  <Male sx={{ color: '#3b82f6', fontSize: 18 }} />
                                }
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {allocation.patientId}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {allocation.gender}, {allocation.age}y
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {allocation.location.includes('Rural') ? 
                                  <LocationOn sx={{ color: '#f59e0b', fontSize: 16 }} /> : 
                                  <LocationCity sx={{ color: '#10b981', fontSize: 16 }} />
                                }
                                <Typography variant="body2">
                                  {allocation.location}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 700, color: '#667eea' }}>
                                {allocation.finalScore}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 200 }}>
                              <Typography variant="body2" color="text.secondary">
                                {allocation.reason}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {allocation.timestamp}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Bias Elimination Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Bias Elimination Progress
                  </Typography>
                  <Grid container spacing={4}>
                    {biasMetrics.map((metric, index) => (
                      <Grid item xs={12} sm={6} key={metric.category}>
                        <Card sx={{ p: 3, height: '100%' }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            {metric.category}
                          </Typography>
                          
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">Before AI</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {(metric.before * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={metric.before * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': { backgroundColor: '#ef4444' }
                              }}
                            />
                          </Box>
                          
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">After AI</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {(metric.after * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={metric.after * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' }
                              }}
                            />
                          </Box>
                          
                          <Chip
                            label={`${metric.improvement.toFixed(1)}% Improvement`}
                            sx={{
                              backgroundColor: '#10b98120',
                              color: '#10b981',
                              fontWeight: 600
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Organ Distribution Tab */}
              {tabValue === 3 && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Organ Type Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={organDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {organDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Monthly Allocation Volume
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={organDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#667eea" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ p: 3, backgroundColor: '#667eea10', border: '1px solid #667eea30' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              🔒 Data Privacy & Security
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All patient data is anonymized and encrypted. This dashboard shows aggregated metrics only, 
              ensuring complete privacy while maintaining transparency in our allocation process.
            </Typography>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TransparencyDashboard;
