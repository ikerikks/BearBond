import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  type: { type: String },
  src: { type: String },
});

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
  },
  file: fileSchema,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  comments: [
    {
      text: { 
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    }
  ],
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

export default Post;