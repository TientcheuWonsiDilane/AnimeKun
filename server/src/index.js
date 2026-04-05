require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    res.status(200).json({ 
      token: jwt.sign({ email }, process.env.JWT_SECRET),
      user: { email, username: name, avatar: picture, isProfileComplete: false }
    });
  } catch (error) {
    res.status(401).json({ message: "Auth Failed" });
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
    const updatedUser = {
      email: req.user.email,
      username: username,
      avatar: avatar,
      isProfileComplete: true
    };

    console.log("Profile updated for:", req.user.email);
   
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error during update" });
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