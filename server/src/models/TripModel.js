import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    destination: { type: String, required: true },
    // Changed to String temporarily to avoid date-formatting crashes from our HTML inputs
    startDate: { type: String, required: true }, 
    endDate: { type: String, required: true },
    estimatedBudget: { type: Number, required: true },
    travelStyle: { type: String, required: true },
    targetVibe: { type: String, required: true },
    
    // 💥 CHANGED: Renamed from 'creator' to 'creatorId' to match your frontend
    creatorId: {
      type: String, 
      required: true,
    },

    // 💥 NEW: The Pending Applicants queue for your Dashboard
    applicants: [
      {
        userId: { type: String },
        status: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
        // Optional fields caching data to make Dashboard rendering faster
        name: { type: String },
        travelStyle: { type: String },
        matchScore: { type: Number }
      }
    ],

    // 💥 CHANGED: Renamed from 'participants' to 'approvedMembers' for the Dashboard
    approvedMembers: [
      {
        userId: { type: String },
        name: { type: String }
      }
    ],

    status: {
      type: String,
      // 'Planning' kept for backward compatibility with any trips already
      // saved under the old enum — new trips default to 'Upcoming' instead.
      // 'Ongoing'/'Completed' are normally derived from dates automatically
      // (see utils/tripStatus.js); 'Cancelled' is the one manual override.
      enum: ['Planning', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    }
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;