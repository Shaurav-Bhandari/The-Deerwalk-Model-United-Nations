const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'transactionReceipt') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Transaction receipt must be an image file.'), false);
    }
  } else if (file.fieldname === 'cv') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('CV must be a PDF file.'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

router.post('/register', upload.fields([
  { name: 'transactionReceipt', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      contactInfo, 
      registerAs,
      // ... other fields
    } = req.body;

    const transactionReceiptPath = req.files['transactionReceipt'] ? req.files['transactionReceipt'][0].path : null;
    const cvPath = req.files['cv'] ? req.files['cv'][0].path : null;

    // Save the data to your database using Prisma
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        contactInfo,
        registerAs,
        // ... other fields
        transactionReceiptPath,
        cvPath,
      },
    });

    res.json({ message: 'Registration successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;