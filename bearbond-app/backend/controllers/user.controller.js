import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

const getUserProfile = async (req, res) => {
  const { username } = req.params; //params are in the url path
  
  try {
    const user = await User.findOne({userName: username})
    .select('-password')
    
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    res.status(200).json(user)
  } catch (err) {
    console.log('Error in the getUserProfile process:', err);
    res.status(500).json({error: 'server error'});
  }
}

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: {$ne: userId}
        }
      },
      { $sample: { size: 5} }
    ]);

    suggestedUsers.map(user=>user.password=null);
    res.status(200).json(suggestedUsers);
  } catch (err) {
    console.log('Error in process:', err);
    res.status(500).json({error: 'server error'});
  }
}

const updateUserProfile = async (req, res) => {
  const { userName, fullName, currentPassword, newPassword, email, bio, link } = req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    if ((!currentPassword && newPassword) ||
      (currentPassword && !newPassword)) {
      return res.status(400).json({error: 'Provide both passwords'});
    }

    if (currentPassword && newPassword) {
      const matchedPasswords = await bcrypt.compare(currentPassword, user.password);
      
      if (!matchedPasswords) {
        return res.status(400).json({error: 'Current password invalid'});
      }
      if (newPassword.length < 6) {
        return res.status(400).json({error: 'Password should be minimum 6 characters long'});
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(email) || email.includes(' ')) {
        return res.status(400).json({error: 'Invalid email format'});
      }

      if (user.email === email) {
        return res.status(400).json({error: 'email already updated'});
      }

      user.email = email;
    }
    
    if (userName) {
      const userExists = await User.findOne({userName});

      if (userExists) {
        if (userExists._id.toString() !== userId.toString()) {
          return res.status(400).json({error: 'Username already taken'});
        }
      }

      if (userName.includes(' ')) {
        return res.status(400).json({error: 'Invalid username format'});
      }

      user.userName = userName;
    }

    if (profileImg) {
      if (user.profileImg) {
        const imgId = user.profileImg.split('/').pop().split('.').shift();
        await cloudinary.uploader.destroy(imgId); // destroys the current img
      }
      const upload = await cloudinary.uploader.upload(profileImg);
      profileImg = upload.secure_url;
      user.profileImg = profileImg;
    }

    if (coverImg) {
      if (user.coverImg) {
        const imgId = user.coverImg.split('/').pop().split('.').shift();
        await cloudinary.uploader.destroy(imgId); // destroys the current img
      }
      const upload = await cloudinary.uploader.upload(coverImg);
      coverImg = upload.secure_url;
      user.coverImg = coverImg;
    }

    if (fullName) {
      if (fullName.trim().split(' ').length < 2) {
        return res.status(400).json({error: 'Full name should contain at least 2 words'});
      }
      user.fullName = fullName;
    }

    if (bio !== undefined) {
      user.bio = bio?.trim() ? bio : null;
    }

    if (link !== undefined) {
      user.link = link?.trim() ? link : null;
    }

    await user.save();
    user.password = null;

    return res.status(200).json(user);

  } catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'server error'});
  }

}

const deleteAccount = async (req, res) => {

  try {
    // Get the  token from the Authorization header
    // const token = req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    console.log('TOKEN:: ', token)
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    // Verify/decode the token to extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Account deleted' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export { getUserProfile, getSuggestedUsers, updateUserProfile, deleteAccount };