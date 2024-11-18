const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const router = express.Router();

// Get courses by IDs
router.get('/:ids', async (req, res) => {
  try {
    const courseIds = req.params.ids.split(',');
    const courses = await Course.find({ _id: { $in: courseIds } });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// Get courses created by the logged-in teacher
router.get('/created', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user.account_type !== 'teacher') {
      return res.status(403).json({ message: "You are not authorized to view created courses" });
    }

    const createdCourses = await Course.find({ 'instructor.name': user.username });
    res.json(createdCourses);
  } catch (err) {
    console.error("Error fetching created courses:", err);
    res.status(500).json({ message: "Failed to fetch created courses" });
  }
});

module.exports = router;
