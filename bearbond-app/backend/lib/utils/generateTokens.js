import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  // token to identify which user has this token by adding the user Id as a payload & encoded with a secret & expiration date
  const token = jwt.sign({userId}, process.env.JWT_SECRET, { //payload userId, secret
    expiresIn: '15d'
  })
  // send it as a cookie to the client
  res.cookie('jwt', token, {
    maxAge: 15*24*60*60*1000, // miliseconds
    httpOnly: true, // prevent XSS attacks cross site scripting attacks
    sameSite: 'strict', // CSRF attacks crosse site request forgery atacks
    secure: process.env.NODE_ENV !== 'development',
  })
}

export default generateTokenAndSetCookie;