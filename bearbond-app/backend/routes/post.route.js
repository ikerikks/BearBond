import express from 'express';

import { 
  createPost, 
  deletePost, 
  commentPost,
  deleteComment, 
  getPostComments, 
  likeUnlikePost, 
  getAllPosts, 
  getUserPosts, 
  getLikedPosts,
  getPost 
} from '../controllers/post.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/create', protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);
router.get('/all', protectRoute, getAllPosts);
router.get('/user/:id', protectRoute, getUserPosts);
router.get('/status/:id', protectRoute, getPost);

router.post('/comment/:id', protectRoute, commentPost); // 'id' we'd like to comment on
router.delete('/comment/:id/delete/:commentId', protectRoute, deleteComment);
router.get('/read/:id', protectRoute, getPostComments); 

router.post('/like/:id', protectRoute, likeUnlikePost);
router.get('/likes/:id', protectRoute, getLikedPosts);

// router.get('/comment', protectRoute, post);


export default router;