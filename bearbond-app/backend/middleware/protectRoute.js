import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const protectRoute = async (req, res, nextFunc) => {
  try {
    const token = req.cookies.jwt; // getting the token from the cookies
    
    if (!token) {
      return res.status(401).json({error: 'Don\'t authorized: Token not provided'});
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) { // if false value or expired
      return res.status(401).json({error: 'Invalid token'});
    }

    const user = await User.findById(decodedToken.userId).select('-password'); // thanks to the payload which has the userId we get the user in the database

    if (!user) { // if false value or expired
      return res.status(404).json({error: 'User not found'});
    }

    req.user = user // add this user field into the request object.
    nextFunc(); // call the next function

  } catch (err) {
    console.log('Error in the protectRout process (middleware):', err);
    res.status(500).json =({error: 'Server error'});
  }
}

export default protectRoute;