const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  course_id: String,
  percentage_completed: Number,
  number_of_videos_watched: Number,
});

const userSchema = new mongoose.Schema({
  username: String,
  mail: String,
  account_type: { type: String, enum: ['teacher', 'student'], required: true },  // Updated field for account type
  learner_points: Number,
  level: String,
  achievements: [String],
  courses_bought: [courseProgressSchema],  // Array to track bought courses
});

// Check if the 'User' model is already defined and avoid overwriting it
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
