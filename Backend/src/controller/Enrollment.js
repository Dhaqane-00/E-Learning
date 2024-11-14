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
    console.log(enrollment);

    res.status(201).json({ 
      message: 'Course Enrolled successfully', 
      enrollment 
    });
  } catch (error) {
    console.log(error);
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
    const { lessonId, moduleId } = req.body;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: userId
    }).populate({
      path: 'course',
      populate: {
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Add completed lesson if provided
    if (lessonId) {
      // Add to overall completed lessons
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.addToSet(lessonId);
      }

      // Update module progress
      if (moduleId) {
        let moduleProgress = enrollment.moduleProgress.find(
          mp => mp.module.toString() === moduleId
        );

        if (!moduleProgress) {
          moduleProgress = {
            module: moduleId,
            completedLessons: [lessonId],
            progress: 0
          };
          enrollment.moduleProgress.push(moduleProgress);
        } else if (!moduleProgress.completedLessons.includes(lessonId)) {
          moduleProgress.completedLessons.push(lessonId);
        }

        // Calculate module progress
        const module = enrollment.course.modules.find(
          m => m._id.toString() === moduleId
        );
        if (module) {
          const moduleCompletionPercentage = 
            (moduleProgress.completedLessons.length / module.lessons.length) * 100;
          moduleProgress.progress = Math.round(moduleCompletionPercentage);
        }
      }

      // Update last accessed lesson
      enrollment.lastAccessedLesson = lessonId;
    }

    // Calculate overall progress
    const totalLessons = enrollment.course.modules.reduce(
      (sum, module) => sum + module.lessons.length, 
      0
    );
    
    const completionPercentage = 
      (enrollment.completedLessons.length / totalLessons) * 100;
    
    enrollment.progress = Math.round(completionPercentage);

    // Update enrollment status
    if (enrollment.progress === 0) {
      enrollment.status = 'not-started';
    } else if (enrollment.progress === 100) {
      enrollment.status = 'completed';
    } else {
      enrollment.status = 'in-progress';
    }

    await enrollment.save();

    res.json({ 
      message: 'Progress updated successfully', 
      enrollment: {
        progress: enrollment.progress,
        status: enrollment.status,
        completedLessons: enrollment.completedLessons,
        moduleProgress: enrollment.moduleProgress,
        lastAccessedLesson: enrollment.lastAccessedLesson
      }
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ 
      message: 'Failed to update progress', 
      error: error.message 
    });
  }
};

// Get enrollment progress
exports.getEnrollmentProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: userId
    })
    .populate('completedLessons')
    .populate('lastAccessedLesson')
    .populate({
      path: 'moduleProgress.module',
      populate: {
        path: 'lessons'
      }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({
      progress: enrollment.progress,
      status: enrollment.status,
      completedLessons: enrollment.completedLessons,
      moduleProgress: enrollment.moduleProgress,
      lastAccessedLesson: enrollment.lastAccessedLesson
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ 
      message: 'Failed to fetch progress', 
      error: error.message 
    });
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