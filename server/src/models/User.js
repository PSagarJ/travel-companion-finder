import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // 💥 Drops accidental leading/trailing spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // 💥 Converts everything to lowercase automatically
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Trust & Safety Features
    isGovIdVerified: {
      type: Boolean,
      default: false, 
    },
    govIdUrl: {
      type: String, 
    },
    // Matchmaking & Gamification Features
    travelStyle: {
      type: String,
      enum: ['Backpacker', 'Luxury', 'Budget', 'Adventure', 'Chill'],
      default: 'Chill',
    },
    vibeBadges: [
      {
        type: String, 
      }
    ]
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);
export default User;