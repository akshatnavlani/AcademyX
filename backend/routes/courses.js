const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { body, validationResult } = require('express-validator');

// Middleware to fetch user details by email
const getUserMiddleware = async (req, res, next) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Attach the user object to the request object for later use
    req.user = user;
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

// Helper to calculate course progress
const calculateCourseProgress = (course, courseProgress) => {
  const totalVideos = course.number_of_videos || 0;
  const videosWatched = courseProgress.number_of_videos_watched || 0;
  const percentageCompleted = totalVideos > 0 ? (videosWatched / totalVideos) * 100 : 0;

  return {
    ...courseProgress,
    percentage_completed: percentageCompleted,
    course_title: course.title || "Untitled Course",
  };
};

// Route to fetch courses created by the logged-in teacher
router.get('/created', getUserMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Check if the user is a teacher
    if (user.account_type !== 'teacher') {
      return res.status(403).json({ message: "Only teachers can create or view created courses" });
    }

    // Fetch courses created by the teacher
    const createdCourses = await Course.find({ "instructor.name": user.username });

    if (createdCourses.length === 0) {
      return res.status(200).json({ message: "No courses created yet" });
    }

    // Respond with created courses
    res.status(200).json({ created_courses: createdCourses });
  } catch (err) {
    console.error("Error fetching created courses:", err.message);
    res.status(500).json({ message: "Failed to fetch created courses" });
  }
});


// Route to fetch user data and courses bought by the user
router.get('/user/:email', getUserMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userCourses = user.courses_bought || [];
    const courseIds = userCourses.map((c) => c.course_id);

    // Fetch all relevant courses in one query
    const courses = await Course.find({ _id: { $in: courseIds } });

    // Map courses and calculate progress
    const coursesProgress = userCourses.map((courseProgress) => {
      const course = courses.find((c) => String(c._id) === String(courseProgress.course_id));
      return course ? calculateCourseProgress(course, courseProgress) : null;
    });

    // Prepare response
    const response = {
      username: user.username || "Guest",
      email: user.email,
      account_type: user.account_type || "student",
      learner_points: user.learner_points || 0,
      level: user.level || "Beginner",
      achievements: user.achievements || [],
      courses_bought: coursesProgress.filter((c) => c !== null),
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Route to create a new course
router.post('/create', [
  body('title').notEmpty().withMessage('Course title is required'),
  body('description').notEmpty().withMessage('Course description is required'),
  body('instructor.name').notEmpty().withMessage('Instructor name is required'),
], getUserMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, instructor, tags, number_of_videos, thumbnail } = req.body;
    const user = req.user;

    // Check if the user exists and is a teacher
    if (user.account_type !== 'teacher') {
      return res.status(403).json({ message: "You are not authorized to create a course" });
    }

    // Create the new course
    const newCourse = new Course({
      title,
      description,
      instructor: {
        name: instructor.name,
        avatar: instructor.avatar || '',
      },
      tags: tags || [],
      number_of_videos: number_of_videos || 0,
      thumbnail: thumbnail || '',
      created_at: new Date(),
    });

    // Save the new course to the database
    const savedCourse = await newCourse.save();

    // Respond with the created course details
    res.status(201).json({
      message: "Course created successfully",
      course: savedCourse
    });

  } catch (err) {
    console.error("Error creating course:", err.message);
    res.status(500).json({ message: "Failed to create course" });
  }
});

// Route to fetch all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// Route to fetch a specific course by its ID
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    console.error("Error fetching course:", err.message);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});

// Route to fetch courses bought by a user (requires user data from middleware)
router.get('/user/:email', getUserMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userCourses = user.courses_bought || [];
    const courseIds = userCourses.map((c) => c.course_id);

    // Fetch all relevant courses
    const courses = await Course.find({ _id: { $in: courseIds } });

    // Map courses and calculate progress
    const coursesProgress = userCourses.map((courseProgress) => {
      const course = courses.find((c) => String(c._id) === String(courseProgress.course_id));
      return course ? {
        ...courseProgress,
        percentage_completed: (courseProgress.number_of_videos_watched / course.number_of_videos) * 100,
        course_title: course.title
      } : null;
    }).filter(c => c !== null);

    // Prepare response with user details and courses
    const response = {
      username: user.username || "Guest",
      email: user.email,
      account_type: user.account_type || "student",
      learner_points: user.learner_points || 0,
      level: user.level || "Beginner",
      achievements: user.achievements || [],
      courses_bought: coursesProgress,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

module.exports = router;
