import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Optional: link this memory back to a trip listing
    tripId: {
      type: String,
    },
    destination: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;