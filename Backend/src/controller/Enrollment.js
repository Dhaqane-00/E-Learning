const { Enrollment, Course, User } = require('../model/Model');

// Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.userId;

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      student: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      student: userId,
      course: courseId,
      paymentStatus: 'Paid'
    });
    await enrollment.save();

    // Update user's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId }
    });

    res.status(201).json({ 
      message: 'Course Enrolled successfully', 
      enrollment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create enrollment', error });
  }
};

// Get all enrollments for a user And Show All Courses
exports.getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const enrollments = await Enrollment.find({ student: userId })
      .populate('student')
      .populate('course')
      .populate('completedLessons')
      .populate('quizScores.lesson');

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollments', error });
  }
};

// Update enrollment progress
exports.updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lessonId, progress } = req.body;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: userId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Update progress
    enrollment.progress = progress;

    // Add completed lesson if provided
    if (lessonId) {
      enrollment.completedLessons.addToSet(lessonId);
    }

    await enrollment.save();

    res.json({ 
      message: 'Progress updated successfully', 
      enrollment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress', error });
  }
};

// Submit quiz score
exports.submitQuizScore = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lessonId, score } = req.body;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: userId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Update or add quiz score
    const quizScoreIndex = enrollment.quizScores.findIndex(
      qs => qs.lesson.toString() === lessonId
    );

    if (quizScoreIndex > -1) {
      enrollment.quizScores[quizScoreIndex].score = score;
    } else {
      enrollment.quizScores.push({ lesson: lessonId, score });
    }

    await enrollment.save();

    res.json({ 
      message: 'Quiz score submitted successfully', 
      enrollment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz score', error });
  }
};

// Get enrollment details
exports.getEnrollmentDetails = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: userId
    })
      .populate('course')
      .populate('completedLessons')
      .populate('quizScores.lesson');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollment details', error });
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOneAndDelete({
      _id: enrollmentId,
      student: userId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Remove course from user's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $pull: { enrolledCourses: enrollment.course }
    });

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete enrollment', error });
  }
}; 