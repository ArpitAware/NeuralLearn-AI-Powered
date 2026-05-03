const express = require('express');
const router = express.Router();
const {
  getPosts, getPost, createPost, updatePost, deletePost, likePost, addComment,
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
