const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { login, verifyToken, demoUsers } = require('../middleware/auth');
const router = express.Router();

/**
 * POST /api/auth/register
 * Register new user (patient, hospital, admin)
 */
router.post('/register', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('userType').isIn(['patient', 'hospital', 'admin']).withMessage('Invalid user type'),
  body('abhaId').optional().isLength({ min: 14, max: 14 }).withMessage('Invalid ABHA ID format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType, abhaId, personalInfo } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const userData = {
      email,
      password: hashedPassword,
      userType,
      abhaId,
      personalInfo,
      isVerified: false,
      createdAt: new Date()
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: 'temp-id', userType, email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        email,
        userType,
        abhaId: userType === 'patient' ? abhaId : undefined
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Hospital portal and admin login
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const loginResult = await login(email, password);

    // Set HTTP-only cookie for additional security
    res.cookie('token', loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    res.json({
      success: true,
      message: 'Login successful',
      token: loginResult.token,
      user: loginResult.user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/patient-login
 * Patient login with email/password or ABHA ID
 */
router.post('/patient-login', [
  body('email').optional().isEmail(),
  body('abhaId').optional().isLength({ min: 14, max: 14 }),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, abhaId, password } = req.body;

    if (!email && !abhaId) {
      return res.status(400).json({ message: 'Email or ABHA ID required' });
    }

    // Mock user for development
    const mockUser = {
      id: 'user-123',
      email: email || 'user@example.com',
      userType: 'patient',
      abhaId: abhaId || '12-3456-7890-1234',
      isVerified: true
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: mockUser.id, userType: mockUser.userType, email: mockUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        userType: mockUser.userType,
        abhaId: mockUser.abhaId,
        isVerified: mockUser.isVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/verify-abha
 * Verify ABHA ID with government database
 */
router.post('/verify-abha', [
  body('abhaId').isLength({ min: 14, max: 14 }).withMessage('Invalid ABHA ID format')
], async (req, res) => {
  try {
    const { abhaId } = req.body;

    // Mock verification for development
    const mockVerification = {
      isValid: true,
      patientInfo: {
        name: 'John Doe',
        age: 45,
        gender: 'male',
        address: 'New Delhi, India',
        medicalHistory: 'Available'
      }
    };

    res.json({
      success: true,
      verified: mockVerification.isValid,
      patientInfo: mockVerification.patientInfo,
      message: 'ABHA ID verified successfully'
    });

  } catch (error) {
    console.error('ABHA verification error:', error);
    res.status(500).json({
      error: 'ABHA verification failed',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and clear cookies
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * GET /api/auth/demo-users
 * Get list of demo users for testing (development only)
 */
router.get('/demo-users', (req, res) => {
  const publicUsers = demoUsers.map(user => ({
    email: user.email,
    name: user.name,
    role: user.role,
    hospitalName: user.hospitalName,
    department: user.department
  }));

  res.json({
    success: true,
    message: 'Demo users available for testing',
    demoUsers: publicUsers,
    credentials: {
      doctor1: { 
        email: 'dr.sharma@aiims.edu', 
        password: 'Doctor@123',
        name: 'Dr. Rajesh Sharma',
        hospital: 'AIIMS New Delhi'
      },
      doctor2: { 
        email: 'dr.priya@pgimer.edu.in', 
        password: 'Doctor@123',
        name: 'Dr. Priya Gupta',
        hospital: 'PGIMER Chandigarh'
      },
      admin: { 
        email: 'admin@aarogyam.gov.in', 
        password: 'AarogyamAdmin@2024',
        name: 'System Administrator',
        hospital: 'Aarogyam Central System'
      }
    },
    testInstructions: {
      loginEndpoint: '/api/auth/login',
      method: 'POST',
      sampleRequest: {
        email: 'dr.sharma@aiims.edu',
        password: 'Doctor@123'
      }
    }
  });
});

/**
 * GET /api/auth/demo-login-page
 * HTML page with demo credentials and quick login buttons
 */
router.get('/demo-login-page', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aarogyam - Demo Login</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            background: white; 
            padding: 2rem; 
            border-radius: 15px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 800px;
            width: 90%;
        }
        .header { 
            text-align: center; 
            margin-bottom: 2rem; 
            color: #333;
        }
        .header h1 { 
            color: #667eea; 
            margin-bottom: 0.5rem;
            font-size: 2.5rem;
        }
        .header p { 
            color: #666; 
            font-size: 1.1rem;
        }
        .credentials-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 1.5rem; 
            margin-bottom: 2rem;
        }
        .credential-card { 
            border: 2px solid #e1e5e9; 
            border-radius: 10px; 
            padding: 1.5rem; 
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .credential-card:hover { 
            border-color: #667eea; 
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
        }
        .credential-card.selected { 
            border-color: #667eea; 
            background: #f8f9ff;
        }
        .role-badge { 
            display: inline-block; 
            padding: 0.25rem 0.75rem; 
            border-radius: 20px; 
            font-size: 0.8rem; 
            font-weight: bold; 
            margin-bottom: 0.5rem;
        }
        .doctor { background: #e3f2fd; color: #1976d2; }
        .admin { background: #fff3e0; color: #f57c00; }
        .login-form { 
            background: #f8f9fa; 
            padding: 1.5rem; 
            border-radius: 10px; 
            margin-bottom: 1.5rem;
        }
        .form-group { 
            margin-bottom: 1rem; 
        }
        .form-group label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 600; 
            color: #333;
        }
        .form-group input { 
            width: 100%; 
            padding: 0.75rem; 
            border: 2px solid #e1e5e9; 
            border-radius: 5px; 
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus { 
            outline: none; 
            border-color: #667eea; 
        }
        .btn { 
            padding: 0.75rem 1.5rem; 
            border: none; 
            border-radius: 5px; 
            font-size: 1rem; 
            font-weight: 600; 
            cursor: pointer; 
            transition: all 0.3s ease;
            margin-right: 0.5rem;
        }
        .btn-primary { 
            background: #667eea; 
            color: white; 
        }
        .btn-primary:hover { 
            background: #5a6fd8; 
            transform: translateY(-1px);
        }
        .btn-secondary { 
            background: #6c757d; 
            color: white; 
        }
        .btn-secondary:hover { 
            background: #5a6268; 
        }
        .result { 
            margin-top: 1rem; 
            padding: 1rem; 
            border-radius: 5px; 
            display: none;
        }
        .result.success { 
            background: #d4edda; 
            color: #155724; 
            border: 1px solid #c3e6cb; 
        }
        .result.error { 
            background: #f8d7da; 
            color: #721c24; 
            border: 1px solid #f5c6cb; 
        }
        .api-info { 
            background: #e9ecef; 
            padding: 1rem; 
            border-radius: 5px; 
            font-family: monospace; 
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Aarogyam</h1>
            <p>Demo Login Credentials - Organ Allocation System</p>
        </div>

        <div class="credentials-grid">
            <div class="credential-card" onclick="fillCredentials('dr.sharma@aiims.edu', 'Doctor@123')">
                <div class="role-badge doctor">👨‍⚕️ Doctor</div>
                <h3>Dr. Rajesh Sharma</h3>
                <p><strong>Hospital:</strong> AIIMS New Delhi</p>
                <p><strong>Department:</strong> Cardiology</p>
                <p><strong>Email:</strong> dr.sharma@aiims.edu</p>
                <p><strong>Password:</strong> Doctor@123</p>
            </div>

            <div class="credential-card" onclick="fillCredentials('dr.priya@pgimer.edu.in', 'Doctor@123')">
                <div class="role-badge doctor">👩‍⚕️ Doctor</div>
                <h3>Dr. Priya Gupta</h3>
                <p><strong>Hospital:</strong> PGIMER Chandigarh</p>
                <p><strong>Department:</strong> Nephrology</p>
                <p><strong>Email:</strong> dr.priya@pgimer.edu.in</p>
                <p><strong>Password:</strong> Doctor@123</p>
            </div>

            <div class="credential-card" onclick="fillCredentials('admin@aarogyam.gov.in', 'AarogyamAdmin@2024')">
                <div class="role-badge admin">👨‍💼 Admin</div>
                <h3>System Administrator</h3>
                <p><strong>Hospital:</strong> Aarogyam Central</p>
                <p><strong>Department:</strong> Administration</p>
                <p><strong>Email:</strong> admin@aarogyam.gov.in</p>
                <p><strong>Password:</strong> AarogyamAdmin@2024</p>
            </div>
        </div>

        <div class="login-form">
            <h3>🔐 Test Login</h3>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">🚀 Login</button>
                <button type="button" class="btn btn-secondary" onclick="clearForm()">🔄 Clear</button>
            </form>
            <div id="result" class="result"></div>
        </div>

        <div class="api-info">
            <h4>📡 API Information:</h4>
            <p><strong>Login Endpoint:</strong> POST /api/auth/login</p>
            <p><strong>Demo Users:</strong> GET /api/auth/demo-users</p>
            <p><strong>Transparency Dashboard:</strong> GET /api/transparency/dashboard</p>
            <p><strong>Server Health:</strong> GET /health</p>
        </div>
    </div>

    <script>
        function fillCredentials(email, password) {
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            // Remove selected class from all cards
            document.querySelectorAll('.credential-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            event.currentTarget.classList.add('selected');
        }

        function clearForm() {
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('result').style.display = 'none';
            document.querySelectorAll('.credential-card').forEach(card => {
                card.classList.remove('selected');
            });
        }

        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const resultDiv = document.getElementById('result');
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = \`
                        <h4>✅ Login Successful!</h4>
                        <p><strong>User:</strong> \${data.user.name}</p>
                        <p><strong>Role:</strong> \${data.user.role}</p>
                        <p><strong>Hospital:</strong> \${data.user.hospitalName}</p>
                        <p><strong>Token:</strong> \${data.token.substring(0, 50)}...</p>
                    \`;
                } else {
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = \`
                        <h4>❌ Login Failed</h4>
                        <p>\${data.message || data.error}</p>
                    \`;
                }
                
                resultDiv.style.display = 'block';
                
            } catch (error) {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = \`
                    <h4>❌ Connection Error</h4>
                    <p>Unable to connect to server. Make sure the server is running on port 5000.</p>
                    <p>Error: \${error.message}</p>
                \`;
                resultDiv.style.display = 'block';
            }
        });

        // Auto-fill first credential on page load
        window.onload = function() {
            fillCredentials('dr.sharma@aiims.edu', 'Doctor@123');
        };
    </script>
</body>
</html>`;

  res.send(html);
});

/**
 * GET /api/auth/ids-reference
 * Complete reference of all Doctor IDs and Hospital IDs
 */
router.get('/ids-reference', (req, res) => {
  const idsReference = demoUsers.map(user => ({
    userType: user.role,
    doctorId: user.id,
    hospitalId: user.hospitalId,
    email: user.email,
    name: user.name,
    hospitalName: user.hospitalName,
    department: user.department,
    permissions: user.permissions
  }));

  res.json({
    success: true,
    message: 'Complete IDs reference for Aarogyam system',
    totalUsers: idsReference.length,
    users: idsReference,
    hospitalIds: [
      {
        hospitalId: 'HOSP_AIIMS_001',
        hospitalName: 'AIIMS New Delhi',
        region: 'Delhi NCR',
        type: 'Government',
        doctors: ['DOC_001']
      },
      {
        hospitalId: 'HOSP_PGIMER_001',
        hospitalName: 'PGIMER Chandigarh',
        region: 'Punjab',
        type: 'Government',
        doctors: ['DOC_002']
      },
      {
        hospitalId: 'HOSP_ADMIN_001',
        hospitalName: 'Aarogyam Central System',
        region: 'All India',
        type: 'Administrative',
        admins: ['ADMIN_001']
      }
    ],
    apiUsage: {
      loginWithIds: {
        endpoint: 'POST /api/auth/login',
        description: 'Returns user object with doctorId and hospitalId',
        sampleResponse: {
          user: {
            id: 'DOC_001',
            hospitalId: 'HOSP_AIIMS_001',
            email: 'dr.sharma@aiims.edu',
            name: 'Dr. Rajesh Sharma'
          }
        }
      },
      hospitalSpecificEndpoints: [
        'PUT /api/transparency/hospital/:hospitalId/stats',
        'GET /api/hospital-portal/patients/real-time?hospitalId=HOSP_AIIMS_001',
        'POST /api/transparency/activity (includes hospitalId in body)'
      ]
    }
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
