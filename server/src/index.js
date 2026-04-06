require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const connectDB = require('./config/db.js');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const Post = require('./models/Post');
const mongoose = require('mongoose');

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
    }

    // FIX: Include _id in the token payload
    const token = jwt.sign(
      { email: user.email, _id: user._id }, 
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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
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

app.post('/api/user/toggle-list', authenticateToken, async (req, res) => {
  const { anime, listType } = req.body;
  const userEmail = req.user.email;

  if (!['watchlist', 'favorites'].includes(listType)) {
    return res.status(400).json({ message: "Invalid list type" });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user[listType].findIndex(item => item.mal_id === anime.mal_id);

    if (index > -1) {
      user[listType].splice(index, 1);
    } else {
      user[listType].push({
        mal_id: anime.mal_id,
        title: anime.title,
        image_url: anime.images.jpg.large_image_url
      });
    }

    await user.save();
    res.status(200).json({ message: "List updated", data: user[listType] });
  } catch (error) {
    res.status(500).json({ message: "Server error updating list" });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

app.post('/api/user/toggle-watched', authenticateToken, async (req, res) => {
  const { animeId } = req.body;
  try {
    const user = await User.findOne({ email: req.user.email });
    const item = user.watchlist.find(i => i.mal_id === animeId);
    if (item) item.watched = !item.watched;
    await user.save();
    res.status(200).json({ data: user.watchlist });
  } catch (err) { res.status(500).send(err); }
});

app.get('/api/posts', async (req, res) => {
  const { q, tag, anime, author } = req.query;
  let query = {};
  if (q) query.title = { $regex: q, $options: 'i' };
  if (tag) query.tags = tag;
  if (anime) query.animeReference = anime;
  if (author) query.author = author;

  try {
    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).send(err); }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, author: req.user._id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) { res.status(500).send(err); }
});

app.post('/api/posts/:id/react', authenticateToken, async (req, res) => {
  const { type } = req.body; 
  try {
    const post = await Post.findById(req.params.id);
    const hasReacted = post[type].includes(req.user._id);

    if (hasReacted) {
      post[type] = post[type].filter(id => id.toString() !== req.user._id.toString());
    } else {
      post[type].push(req.user._id);
      const opposite = type === 'likes' ? 'dislikes' : 'likes';
      post[opposite] = post[opposite].filter(id => id.toString() !== req.user._id.toString());
    }
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).send(err); }
});

app.get('/api/posts/my-posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { _id, author, ...updateData } = req.body;
    const post = await Post.findOneAndUpdate(
      { 
        _id: req.params.id, 
        author: new mongoose.Types.ObjectId(req.user._id) 
      },
      { $set: updateData },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Post.findOneAndDelete({ 
      _id: req.params.id, 
      author: new mongoose.Types.ObjectId(req.user._id) 
    });

    if (!result) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .populate('comments.replies.user', 'username avatar');
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  const { text, parentCommentId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });

    if (parentCommentId) {
      const comment = post.comments.id(parentCommentId);
      comment.replies.push({ user: user._id, text });
    } else {
      post.comments.push({ user: user._id, text });
    }

    await post.save();
    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .populate('comments.replies.user', 'username avatar');
    
    res.json(updatedPost);
  } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));