require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const connectDB = require('./config/db.js');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 
        Authorization: `Bearer ${access_token}` 
      }
    });

    const { email, name, picture } = googleResponse.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        username: name,
        avatar: picture,
        isProfileComplete: false
      });
      await user.save();
      console.log(`New user registered: ${email}`);
    } else {
      console.log(`Returning user logged in: ${email}`);
    }

    const token = jwt.sign(
      { email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res.status(401).json({ message: "Invalid Google Access Token" });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.put('/api/auth/update-profile', authenticateToken, async (req, res) => {
  const { username, avatar } = req.body;
  
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { 
        username: username, 
        avatar: avatar, 
        isProfileComplete: true 
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Profile updated for:", user.email);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

const JIKAN_URL = "https://api.jikan.moe/v4";

app.get('/api/anime/popular', async (req, res) => {
    try {
        const response = await axios.get(`${JIKAN_URL}/top/anime?limit=10`);
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching from Jikan" });
    }
});

app.get('/api/anime/search', async (req, res) => {
    const { q } = req.query; 
    try {
        const response = await axios.get(`${JIKAN_URL}/anime?q=${q}&limit=15`);
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ message: "Search failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));