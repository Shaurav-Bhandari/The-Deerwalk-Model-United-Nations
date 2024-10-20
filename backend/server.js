const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');
const { exportAllTablesToCSV, insertUser, insertDelegate, insertExecutive } = require('./dbOperations');

const app = express();

app.use(cors());
app.use(express.json());

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'transactionReceipt') {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed for transaction receipt!'), false);
      }
    } else if (file.fieldname === 'cv') {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error('Only PDF files are allowed for CV!'), false);
      }
    }
    cb(null, true);
  }
}).fields([
  { name: 'transactionReceipt', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Combined registration route
app.post('/api/register', (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const { registerAs, ...formData } = req.body;

      console.log('Received form data:', formData);

      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        contactInfo: formData.contactInfo
      };

      console.log('User data to insert:', userData);

      const userId = await insertUser(userData);

      console.log('User inserted, ID:', userId);

      if (registerAs === 'Delegate') {
        const delegateData = {
          institute: formData.institute,
          address: formData.address,
          grade: formData.grade,
          munExperience: parseInt(formData.munExperience),
          primaryCommittee: formData.primaryCommittee,
          secondaryCommittee: formData.secondaryCommittee,
          foodPreference: formData.foodPreference,
          paymentMethod: formData.paymentMethod,
          transactionReceipt: req.files && req.files.transactionReceipt ? req.files.transactionReceipt[0].path : null
        };

        console.log('Delegate data to insert:', delegateData);

        const delegateId = await insertDelegate(userId, delegateData);
        console.log('Delegate inserted, ID:', delegateId);
        res.json({ message: 'Delegate registration successful', userId, delegateId });
      } else if (registerAs === 'Executive') {
        const executiveData = {
          committee: formData.primaryCommittee,
          position: formData.position,
          cvUrl: req.files && req.files.cv ? req.files.cv[0].path : null
        };

        console.log('Executive data to insert:', executiveData);

        const executiveId = await insertExecutive(userId, executiveData);
        console.log('Executive inserted, ID:', executiveId);
        res.json({ message: 'Executive registration successful', userId, executiveId });
      } else {
        res.status(400).json({ error: 'Invalid registration type' });
      }
    } catch (error) {
      console.error('Error processing registration:', error);
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Schedule CSV export every 12 hours
cron.schedule('0 */12 * * *', () => {
  console.log('Running scheduled CSV export');
  exportAllTablesToCSV().catch(console.error);
});

const PORT = process.env.PORT || 3000;

// Function to start the server
async function startServer() {
  try {
    // Run initial CSV export
    await exportAllTablesToCSV();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();