import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const userNotifications = await Notification.find({from: {$ne: userId},to: userId})
    .sort({createdAt: -1})
    .populate({path: 'from', select: 'userName profileImg'})
    .populate({path: 'post'})

    res.status(200).json(userNotifications);
    
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({to: userId});

    res.status(200).json({message: 'All notifications deleted'});
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const deleteOneNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const {id:notifId} = req.params;
    const notification = await Notification.findById(notifId);

    if (!notification) {
      return res.status(404).json({error: 'Notification not found'});
    }

    if (String(notification.to) !== String(userId)) {
      return res.status(404).json({error: 'You\'re unauthorized to delete this notification'});
    }

    await Notification.findByIdAndDelete(notifId);

    res.status(200).json({message: 'Notification deleted'});
    
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const readNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const {id:notifId} = req.params;
    const notification = await Notification.findOneAndUpdate(
      {to: userId, _id: notifId}, {read: true});

    if (!notification) {
      return res.status(404).json({error: 'Notification not found'});
    }
    res.status(200).json({message: 'notification read'}); 
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}

const unreadNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const {id:notifId} = req.params;
    const notification = await Notification.findOneAndUpdate(
      {to: userId, _id: notifId}, {read: false});

    if (!notification) {
      return res.status(404).json({error: 'Notification not found'});
    }
    res.status(200).json({message: 'notification unread'}); 
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({error: 'Server error'});
  }
}


export { 
  getNotifications, 
  deleteNotifications, 
  deleteOneNotification,
  readNotification,
  unreadNotification 
};