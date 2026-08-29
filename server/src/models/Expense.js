import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  paidBy: {
    type: String, // Stores the user ID string
    required: true
  },
  payerName: {
    type: String, // Cached user name for quick frontend layout mapping
    required: true
  }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;