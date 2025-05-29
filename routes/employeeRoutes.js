import express, { Router } from 'express';
import { addEmployee, deleteEmployee, getEmployeeById, getAllEmployees, searchEmployees, updateEmployee } from '../controllers/employeeController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename conflicts
  },
});

const upload = multer({ storage: storage });

// Initialize router
const router = Router();

// Routes
router.post('/employees', authMiddleware, upload.single('idProof'), addEmployee);
router.get('/employees', authMiddleware, getAllEmployees);
router.get('/employee/:employeeId', authMiddleware, getEmployeeById);
router.get('/employees/search', authMiddleware, searchEmployees);
router.put('/employee/:employeeId', authMiddleware, upload.single('idProof'), updateEmployee);
router.delete('/employee/:employeeId', authMiddleware, deleteEmployee);

export default router;
