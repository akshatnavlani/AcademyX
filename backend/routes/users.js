const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define user schema
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  mail: String,
  account_type: String,
  learner_points: Number,
  level: String,
  achievements: Array,
  courses_bought: Array,  // Array of course IDs
}));

// POST route to save a new user to the database
router.post('/', async (req, res) => {
  try {
    const { username, mail, account_type, learner_points, level, achievements, courses_bought } = req.body;
    const newUser = new User({
      username,
      mail,
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

// GET route to fetch the logged-in user's details
router.get("/me", async (req, res) => {
  try {
    // Assuming you have user authentication set up and you can get the logged-in user
    const email = req.user.email; // Replace with actual authentication logic (e.g., JWT token)
    const user = await User.findOne({ mail: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sending user data, including courses bought
    res.json({
      name: user.username,
      level: user.level,
      achievements: user.achievements,
      accountType: user.account_type,
      coursesBought: user.courses_bought, // List of course IDs the user has bought
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

module.exports = router;
