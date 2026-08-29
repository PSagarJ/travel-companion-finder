import streamifier from 'streamifier';
import Post from '../models/Post.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// Helper: stream a file buffer (from multer) up to Cloudinary
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'travel-buddy-finder/posts' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// POST: Create a new travel photo post
export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'An image file is required' });
    }

    const { caption, tripId, destination } = req.body;

    const result = await uploadBufferToCloudinary(req.file.buffer);

    const user = await User.findById(req.user.id);

    const newPost = new Post({
      userId: req.user.id, // from the verified token, never the client
      userName: user ? user.name : 'Explorer',
      imageUrl: result.secure_url,
      caption,
      tripId,
      destination,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// GET: Fetch all posts for the main feed
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// GET: Fetch all posts by a single user (for their profile grid)
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
};

// GET: Fetch all posts linked to a single trip
export const getTripPosts = async (req, res) => {
  try {
    const { tripId } = req.params;
    const posts = await Post.find({ tripId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching trip posts:', error);
    res.status(500).json({ message: 'Error fetching trip posts', error: error.message });
  }
};

// DELETE: Remove a post (only the author can delete their own post)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own posts.' });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};