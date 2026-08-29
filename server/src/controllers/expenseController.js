import Expense from '../models/Expense.js';

// POST: Add a new expense item to a trip
export const addExpense = async (req, res) => {
  try {
    const { tripId, description, amount, paidBy, payerName } = req.body;

    if (!tripId || !description || !amount || !paidBy || !payerName) {
      return res.status(400).json({ message: 'All expense parameters are required.' });
    }

    const newExpense = new Expense({
      tripId,
      description,
      amount: parseFloat(amount),
      paidBy,
      payerName
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: 'Error saving expense item', error: error.message });
  }
};

// GET: Fetch all expenses for a single trip
export const getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.find({ tripId }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: 'Error retrieving trip expenses', error: error.message });
  }
};