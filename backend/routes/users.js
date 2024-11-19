const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define user schema
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  account_type: String,
  learner_points: Number,
  level: String,
  achievements: Array,
  courses_bought: Array,  // Array of course IDs
}));

// POST route to save a new user to the database
router.post('/', async (req, res) => {
  try {
    const { username, email, account_type, learner_points, level, achievements, courses_bought } = req.body;
    const newUser = new User({
      username,
      email,
      account_type,
      learner_points,
      level,
      achievements,
      courses_bought,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving user' });
  }
});

module.exports = router;
