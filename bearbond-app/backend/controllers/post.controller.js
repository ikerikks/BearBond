import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

import { v2 as cloudinary } from 'cloudinary';

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { file } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    if (!text && !file.src) {
      return res.status(400).json({error: 'The post must have an image or a text'});
    }

    if (file.src) {
      const upload = await cloudinary.uploader.upload(file.src, {resource_type: 'auto'});
      file.src = upload.secure_url;
    }
    
    const newPost = new Post({
      user: userId,
      text,
      file: {
        type: file.type, 
        src: file.src
      },
    });

    await newPost.save();
    res.status(201).json(newPost);
    
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({error: 'Post not found'});
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({error: 'You are not allow to delete this post'});
    }

    if (post.img) {
      const imgId = post.img.split('/').pop().split('.').shift();
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({message: 'post deleted with success'});
    
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const commentPost = async (req, res) => {
  try {
    const { comment } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!comment || !(comment.trim())) {
      return res.status(400).json({error: 'Text required'});
    }
    const post = await Post.findById(postId);

    if (!comment) {
      return res.status(404).json({error: 'Post not found'});
    }
    
    post.comments.push({
      user: userId,
      text: comment,
    })
    await post.save();
    
    const notification = new Notification({
      type: 'comment',
      from: userId,
      to: post.user,
      post: post._id,
    });
    await notification.save();

    res.status(200).json(post);

  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const {commentId} = req.params;

    if (!post) {
      return res.status(404).json({error: 'Post not found'});
    }

    const [comment] = post.comments.filter((comment) => 
      comment._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({error: 'Comment not found'});
    }

    const newComments = post.comments.filter((comment) => 
      comment._id.toString() !== commentId);

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({error: 'You are not allow to delete this comment'});
    }

    post.comments = newComments;
    await post.save();
    res.status(200).json({message: 'comment deleted with success'});
    
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({error: 'Post not found'});
    }
    
    if (post.user.toString() !== req.user._id.toString()) {
      const myComments = post.comments.filter(
        (comment) => comment.user.toString() === req.user._id.toString()
      );
      return res.status(200).json(myComments);
    }

    res.status(200).json(post.comments);

  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    const postOwner = await User.findById(post.user);
    
    if (!post) {
      return res.status(404).json({error: 'Post not found'});
    }
    
    const postAlreadyLiked = post.likes.includes(userId);
    
    if (postAlreadyLiked) {
      await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
      await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
      res.status(200).json({message: 'Bond: discarded'});
    } else {
      post.likes.push(userId);
      await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
      await post.save();

      const notification = new Notification({
        type: 'like',
        from: userId,
        to: post.user,
        post: post._id,
      });

      await notification.save();
      res.status(200).json({message: `Bond! @${postOwner.userName} will be notified`});
    }

  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const getAllPosts = async (req, res) => {
  try {
    
    const userId = req.user._id;
    const allPosts = await Post.find().sort({createdAt: -1})
      .populate({path: 'user', select: '-password'})
      .populate({path: 'comments.user', select: '-password'});
    
    if (allPosts.length === 0) {
      return res.status(200).json([]);
    }
      
    res.status(200).json(allPosts);

  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const getUserPosts = async (req, res) => {
  try {
    const userName = req.params.username;
    const user = await User.findOne({userName});
    
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const userPosts = await Post.find({user: String(user._id)})
    .sort({createdAt: -1})
    .populate({path: 'user', select: '-password'})
    .populate({path: 'comments.user', select: '-password'})

    if (!userPosts) {
      return res.status(404).json({error: 'POSTS not found'});
    }
    
    res.status(200).json(userPosts);

  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
    .populate({path: 'user', select: '-password'})
    .populate({path: 'comments.user', select: '-password'})

    if (!likedPosts) {
      return res.status(404).json({error: 'POSTS not found'});
    }
    
    res.status(200).json(likedPosts);

  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const getPost = async (req, res) => {
  try {
    
    // const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId)
    .populate({path: 'user', select: ['-password']})
    .populate({path: 'comments.user', select: ['-password']});

    if (!post) {
      return res.status(404).json({error: 'post not found'});
    }
    res.status(200).json(post);
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}


export { 
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
};