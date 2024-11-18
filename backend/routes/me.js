const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET route to fetch the logged-in user's details (protected route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Access user ID from the token payload

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the percentage of courses completed based on the number of videos watched
    const coursesProgress = await Promise.all(user.courses_bought.map(async (courseProgress) => {
      const course = await Course.findById(courseProgress.course_id);

      if (!course) {
        return null;
      }

      const totalVideos = course.number_of_videos;
      const videosWatched = courseProgress.number_of_videos_watched;

      // Calculate percentage completion
      const percentageCompleted = (videosWatched / totalVideos) * 100;

      return {
        ...courseProgress._doc,
        percentage_completed: percentageCompleted,  // Add the calculated percentage
        course_title: course.title,  // Include the course title
      };
    }));

    // Return user data along with course progress
    res.json({
      username: user.username,
      mail: user.mail,
      account_type: user.account_type,
      learner_points: user.learner_points,
      level: user.level,
      achievements: user.achievements,
      courses_bought: coursesProgress.filter(course => course !== null),  // Filter out null results
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

module.exports = router;
