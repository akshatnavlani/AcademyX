const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET route to fetch the logged-in user's details (protected route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Fetch user details using the authenticated user ID
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate course progress and fetch course details
    const coursesProgress = await Promise.all(
      user.courses_bought.map(async (courseProgress) => {
        try {
          const course = await Course.findById(courseProgress.course_id);

          if (!course) {
            console.warn(`Course with ID ${courseProgress.course_id} not found`);
            return null; // Exclude non-existent courses
          }

          const totalVideos = course.number_of_videos || 1; // Avoid division by zero
          const videosWatched = courseProgress.number_of_videos_watched || 0;
          const percentageCompleted = Math.round((videosWatched / totalVideos) * 100);

          return {
            course_id: course._id,
            percentage_completed: percentageCompleted,
            course_title: course.title,
          };
        } catch (error) {
          console.error(`Error processing course ID ${courseProgress.course_id}:`, error);
          return null; // Exclude problematic courses
        }
      })
    );

    res.json({
      username: user.username,
      mail: user.mail,
      account_type: user.account_type,
      learner_points: user.learner_points,
      level: user.level,
      achievements: user.achievements,
      courses_bought: coursesProgress.filter(Boolean), // Remove null values
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

module.exports = router;
