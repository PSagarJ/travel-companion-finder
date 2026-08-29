import express from 'express';
import multer from 'multer';
import { createPost, getAllPosts, getUserPosts, getTripPosts, deletePost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Keep the file in memory as a buffer so we can stream it straight to Cloudinary
// without ever writing it to disk. Cap at 5MB and only allow image mimetypes.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// Public: anyone can browse the feed
router.get('/', getAllPosts);
router.get('/user/:userId', getUserPosts);
router.get('/trip/:tripId', getTripPosts);

// Protected: must be logged in to post or delete
router.post('/', protect, upload.single('image'), createPost);
router.delete('/:id', protect, deletePost);

export default router;