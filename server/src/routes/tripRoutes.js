import express from 'express';
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateApplicationStatus,
  applyForTrip,
  getUserTrips,
  deleteTrip
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: anyone can browse trips
router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.get('/user/:userId', getUserTrips);

// Protected: must be logged in
router.post('/', protect, createTrip);
router.post('/:id/apply', protect, applyForTrip);
router.put('/:id/status', protect, updateApplicationStatus);
router.delete('/:id', protect, deleteTrip);

export default router;