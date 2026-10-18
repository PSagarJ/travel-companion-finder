import mongoose from 'mongoose';
import Trip from '../models/TripModel.js';
import User from '../models/User.js';
import { deriveTripStatus } from '../utils/tripStatus.js';

// POST: Create a new trip (whitelisted fields to prevent mass assignment)
export const createTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      estimatedBudget,
      travelStyle,
      targetVibe,
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 100) {
      return res.status(400).json({ message: 'Trip title must be between 3 and 100 characters.' });
    }

    if (!destination || typeof destination !== 'string' || destination.trim().length < 2 || destination.trim().length > 100) {
      return res.status(400).json({ message: 'Destination must be between 2 and 100 characters.' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date.' });
    }

    const parsedBudget = Number(estimatedBudget);
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({ message: 'Estimated budget must be a positive number.' });
    }

    // Whitelist explicitly — client cannot inject applicants, approvedMembers, or status
    const newTrip = new Trip({
      title: title.trim(),
      destination: destination.trim(),
      startDate: String(startDate),
      endDate: String(endDate),
      estimatedBudget: parsedBudget,
      travelStyle: typeof travelStyle === 'string' ? travelStyle.trim() : 'Chill',
      targetVibe: typeof targetVibe === 'string' ? targetVibe.trim() : 'Relaxed',
      creatorId: req.user.id,
      applicants: [],
      approvedMembers: [],
      status: 'Upcoming',
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: 'Error creating trip' });
  }
};

// GET all trips for the Community Board
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 }).lean();
    // Status is derived fresh on every read, not trusted from a stored
    // value that would silently go stale as days pass.
    const tripsWithStatus = trips.map((trip) => ({
      ...trip,
      status: deriveTripStatus(trip),
    }));
    res.status(200).json(tripsWithStatus);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

// GET a single trip by ID
export const getTripById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    const trip = await Trip.findById(req.params.id).lean();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json({ ...trip, status: deriveTripStatus(trip) });
  } catch (error) {
    console.error("Error fetching single trip:", error);
    res.status(500).json({ message: 'Error fetching trip' });
  }
};

// POST: Apply to join a trip
export const applyForTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // from verified token, not req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Edge case: Creator cannot apply to their own trip
    if (trip.creatorId === userId) {
      return res.status(400).json({ message: 'You are the creator of this trip and cannot apply as an applicant.' });
    }

    // Edge case: Already an approved member
    const alreadyApproved = trip.approvedMembers?.some(m => m.userId === userId);
    if (alreadyApproved) {
      return res.status(400).json({ message: 'You are already an approved member of this trip!' });
    }

    const alreadyApplied = trip.applicants.some(app => app.userId === userId);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this trip!' });
    }

    const user = await User.findById(userId);
    const applicantName = user ? user.name : 'Explorer';
    const applicantStyle = user ? user.travelStyle : 'Chill';

    trip.applicants.push({
      userId,
      name: applicantName,
      travelStyle: applicantStyle,
      status: 'pending'
    });

    await trip.save();
    res.status(200).json({ message: 'Application successful!', trip });
  } catch (error) {
    console.error("Error applying for trip:", error);
    res.status(500).json({ message: 'Error applying for trip' });
  }
};

// PUT: Update application status (Approve / Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected.' });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Only the trip's creator (the verified caller) may approve/reject applicants
    if (trip.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Only the trip creator can update application status.' });
    }

    const applicant = trip.applicants.find(app => app.userId === userId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found on this trip' });
    }

    applicant.status = status;

    if (status === 'approved') {
      const alreadyApproved = trip.approvedMembers.some(m => m.userId === userId);
      if (!alreadyApproved) {
        trip.approvedMembers.push({
          userId: applicant.userId,
          name: applicant.name
        });
      }
    } else if (status === 'rejected') {
      trip.approvedMembers = trip.approvedMembers.filter(m => m.userId !== userId);
    }

    await trip.save();
    res.status(200).json({ message: `Applicant successfully ${status}!`, trip });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: 'Error updating application status' });
  }
};

// GET: Fetch all trips relevant to a specific user (Hosted OR Joined)
export const getUserTrips = async (req, res) => {
  try {
    const { userId } = req.params;

    const trips = await Trip.find({
      $or: [
        { creatorId: userId },
        { "approvedMembers.userId": userId }
      ]
    }).sort({ createdAt: -1 }).lean();

    const tripsWithStatus = trips.map((trip) => ({
      ...trip,
      status: deriveTripStatus(trip),
    }));

    res.status(200).json(tripsWithStatus);
  } catch (error) {
    console.error("Error fetching user trips:", error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

// PUT: Cancel a trip
export const cancelTrip = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Only the creator can cancel this trip.' });
    }

    trip.status = 'Cancelled';
    await trip.save();

    res.status(200).json({ message: 'Trip cancelled.', trip });
  } catch (error) {
    console.error("Error cancelling trip:", error);
    res.status(500).json({ message: 'Error cancelling trip' });
  }
};

// DELETE: Safely remove a trip entry from MongoDB
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Only the verified, authenticated creator can delete
    if (trip.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Only the creator can delete this trip listing.' });
    }

    await Trip.findByIdAndDelete(id);
    res.status(200).json({ message: 'Trip successfully removed from the platform!' });
  } catch (error) {
    console.error("Error deleting trip document:", error);
    res.status(500).json({ message: 'Error deleting trip' });
  }
};