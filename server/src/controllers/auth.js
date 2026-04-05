const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, picture } = ticket.getPayload();

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({ googleId, email, avatar: picture });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: "Google Auth Failed" });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { username, avatar, isProfileComplete: true }, 
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};