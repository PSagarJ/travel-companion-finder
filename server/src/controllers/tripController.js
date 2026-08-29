import Trip from '../models/TripModel.js';
import User from '../models/User.js';

// POST: Create a new trip
export const createTrip = async (req, res) => {
  try {
    // The creator is whoever is authenticated, not whatever the client claims
    const newTrip = new Trip({ ...req.body, creatorId: req.user.id });
    const savedTrip = await newTrip.save();

    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("Error creating trip:", error.message);
    res.status(500).json({ message: 'Error creating trip', error: error.message });
  }
};

// GET all trips for the Community Board
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

// GET a single trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching single trip:", error);
    res.status(500).json({ message: 'Error fetching trip', error: error.message });
  }
};

// POST: Apply to join a trip
export const applyForTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // from verified token, not req.body

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
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
    res.status(500).json({ message: 'Error applying for trip', error: error.message });
  }
};

// PUT: Update application status (Approve / Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, status } = req.body; // userId here = the applicant being approved/rejected, not the caller

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
    res.status(500).json({ message: 'Error updating application status', error: error.message });
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
    }).sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching user trips:", error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

// DELETE: Safely remove a trip entry from MongoDB
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Only the verified, authenticated creator can delete — not whoever the client claims to be
    if (trip.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Only the creator can delete this trip listing.' });
    }

    await Trip.findByIdAndDelete(id);
    res.status(200).json({ message: 'Trip successfully removed from the platform!' });
  } catch (error) {
    console.error("Error deleting trip document:", error);
    res.status(500).json({ message: 'Error deleting trip', error: error.message });
  }
};