const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Demo users for hospital portal access
const demoUsers = [
  {
    id: 'DOC_001',
    email: 'dr.sharma@aiims.edu',
    password: '$2a$10$rQJ8vQZ9Xm9Xm9Xm9Xm9XeOKvQZ9Xm9Xm9Xm9Xm9Xm9Xm9Xm9Xm9X', // Doctor@123
    name: 'Dr. Rajesh Sharma',
    role: 'doctor',
    hospitalId: 'HOSP_AIIMS_001',
    hospitalName: 'AIIMS New Delhi',
    department: 'Cardiology',
    permissions: ['view_patients', 'manage_attendance', 'access_transparency']
  },
  {
    id: 'DOC_002',
    email: 'dr.priya@pgimer.edu.in',
    password: '$2a$10$rQJ8vQZ9Xm9Xm9Xm9Xm9XeOKvQZ9Xm9Xm9Xm9Xm9Xm9Xm9Xm9Xm9X', // Doctor@123
    name: 'Dr. Priya Gupta',
    role: 'doctor',
    hospitalId: 'HOSP_PGIMER_001',
    hospitalName: 'PGIMER Chandigarh',
    department: 'Nephrology',
    permissions: ['view_patients', 'manage_attendance', 'access_transparency']
  },
  {
    id: 'ADMIN_001',
    email: 'admin@aarogyam.gov.in',
    password: '$2a$10$rQJ8vQZ9Xm9Xm9Xm9Xm9XeOKvQZ9Xm9Xm9Xm9Xm9Xm9Xm9Xm9Xm9X', // AarogyamAdmin@2024
    name: 'System Administrator',
    role: 'admin',
    hospitalId: 'HOSP_ADMIN_001',
    hospitalName: 'Aarogyam Central System',
    department: 'Administration',
    permissions: ['full_access', 'manage_hospitals', 'view_all_data', 'access_transparency']
  }
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId,
      permissions: user.permissions
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '8h' }
  );
};

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.cookies?.token ||
                req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

// Check if user has specific permission
const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    if (req.user.permissions.includes('full_access') || 
        req.user.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions.'
      });
    }
  };
};

// Login function
const login = async (email, password) => {
  const user = demoUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // For demo purposes, we'll accept the plain text passwords
  // In production, use bcrypt.compare(password, user.password)
  const validPasswords = {
    'dr.sharma@aiims.edu': 'Doctor@123',
    'dr.priya@pgimer.edu.in': 'Doctor@123',
    'admin@aarogyam.gov.in': 'AarogyamAdmin@2024'
  };

  if (validPasswords[email] !== password) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hospitalId: user.hospitalId,
      hospitalName: user.hospitalName,
      department: user.department,
      permissions: user.permissions
    }
  };
};

// Get user by ID
const getUserById = (id) => {
  return demoUsers.find(u => u.id === id);
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Admin access required.'
    });
  }
};

// Middleware to check if user is doctor or admin
const isDoctorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Doctor or admin access required.'
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  hasPermission,
  login,
  getUserById,
  isAdmin,
  isDoctorOrAdmin,
  demoUsers
};
