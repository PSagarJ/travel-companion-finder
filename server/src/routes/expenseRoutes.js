import express from 'express';
import { addExpense, getTripExpenses } from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST requests to http://localhost:5000/api/expenses
router.post('/', protect, addExpense);

// GET requests to http://localhost:5000/api/expenses/:tripId
router.get('/:tripId', protect, getTripExpenses);

export default router;