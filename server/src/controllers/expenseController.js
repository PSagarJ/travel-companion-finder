import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import Trip from '../models/TripModel.js';

// POST: Add a new expense item to a trip
export const addExpense = async (req, res) => {
  try {
    const { tripId, description, amount, paidBy, payerName } = req.body;

    if (!tripId || !description || amount === undefined || !paidBy || !payerName) {
      return res.status(400).json({ message: 'All expense parameters are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: 'Invalid trip ID format.' });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10000000) {
      return res.status(400).json({ message: 'Amount must be a positive number greater than 0.' });
    }

    if (typeof description !== 'string' || description.trim().length === 0 || description.trim().length > 200) {
      return res.status(400).json({ message: 'Description must be between 1 and 200 characters.' });
    }

    // Verify trip exists and calling user is a member/creator
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const isMember =
      trip.creatorId === req.user.id ||
      trip.approvedMembers?.some((m) => m.userId === req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: 'Unauthorized: Only trip members can add expenses.' });
    }

    const newExpense = new Expense({
      tripId,
      description: description.trim(),
      amount: Math.round(parsedAmount * 100) / 100, // Round to 2 decimal places
      paidBy: String(paidBy),
      payerName: String(payerName).trim(),
    });

    const savedExpense = await newExpense.save();

    // Broadcast update to anyone viewing this trip's room
    const io = req.app.get('io');
    if (io) {
      io.to(tripId).emit('expense_added', savedExpense);
    }

    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: 'Error saving expense item' });
  }
};

// GET: Fetch all expenses for a single trip
export const getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: 'Invalid trip ID format.' });
    }

    const expenses = await Expense.find({ tripId }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: 'Error retrieving trip expenses' });
  }
};