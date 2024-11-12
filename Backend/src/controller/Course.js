const { Course, User, Enrollment } = require('../model/Model');
const bunnyStorage = require('../utils/bunnycdn');
// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category, tags } = req.body;
    const instructor = req.user.userId; // From auth middleware

    // Handle file upload to Bunny CDN on thumbnailImage
    let thumbnailImage = 'https://cdn.pixabay.com/photo/2022/01/28/12/17/distance-learning-6974511_1280.jpg';

    // Handle file upload to Bunny CDN
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      await bunnyStorage.upload(
        req.file.buffer,
        `/course/${fileName}`
      );
      thumbnailImage = `${process.env.BUNNY_CDN_URL}/course/${fileName}`;
    }

    const course = new Course({
      title,
      description,
      instructor,
      price,
      category,
      thumbnailImage,
      tags
    });

    await course.save();
    console.log(course);
    
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create course', error });
  }
};

// Get all courses with payment status for home page
exports.getAllCourses = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    
    // Get all courses with instructor details
    const courses = await Course.find()
      .populate('instructor', 'name email role profileImage')
      .select('-modules');

    if (!userId) {
      // If user is not logged in, return courses without enrollment status
      return res.status(200).json({
        message: "Courses fetched successfully",
        courses: courses.map(course => ({
          ...course.toObject(),
          enrollmentStatus: null,
          message: "Enroll Now"
        }))
      });
    }

    // Get user's enrollments
    const enrollments = await Enrollment.find({ student: userId });
    const enrollmentMap = new Map(
      enrollments.map(enrollment => [
        enrollment.course.toString(),
        {
          status: enrollment.paymentStatus,
          progress: enrollment.progress,
          enrollmentId: enrollment._id
        }
      ])
    );

    // Add enrollment status and appropriate message to each course
    const coursesWithStatus = courses.map(course => {
      const enrollment = enrollmentMap.get(course._id.toString());
      
      if (!enrollment) {
        return {
          ...course.toObject(),
          enrollmentStatus: null,
          message: "Enroll Now"
        };
      }

      return {
        ...course.toObject(),
        enrollmentStatus: enrollment.status,
        enrollmentId: enrollment.enrollmentId,
        progress: enrollment.progress,
        message: enrollment.status === 'Paid' 
          ? "Continue Learning"
          : "Complete Payment"
      };
    });

    res.status(200).json({
      message: "Courses fetched successfully",
      courses: coursesWithStatus

    });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ 
      message: 'Failed to fetch courses', 
      error: error.message 
    });
  }
};

// // Get all courses with instructor details and without modules
// exports.getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find()
//       .populate('instructor', 'name email role profileImage enrolledCourses')
//       .select('-modules');
//     res.json({message: "Courses fetched successfully", courses});
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch courses', error });
//   }
// };
//get All Courses that user is enrolled in
exports.getAllCoursesByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const courses = await Course.find({_id: {$in: userId.enrolledCourses}})
    res.json({message: "Courses fetched successfully", courses});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};

// Get course by  details and modules
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profileImage')
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
          model: 'Lesson'
        }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course', error });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, price, category, thumbnailImage, tags } = req.body;
    const courseId = req.params.id;
    const instructor = req.user.userId;

    const course = await Course.findOne({ _id: courseId, instructor });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        price,
        category,
        thumbnailImage,
        tags
      },
      { new: true }
    ).populate('instructor', 'name email profileImage');

    res.json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course', error });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructor = req.user.userId;

    const course = await Course.findOne({ _id: courseId, instructor });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course', error });
  }
};

// Get courses by instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.userId;
    const courses = await Course.find({ instructor: instructorId })
      .populate('instructor', 'name email profileImage')
      .select('-modules');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch instructor courses', error });
  }
};

// Search courses
exports.searchCourses = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    
    let searchCriteria = {};
    
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }
    
    if (category) {
      searchCriteria.category = category;
    }
    
    if (minPrice || maxPrice) {
      searchCriteria.price = {};
      if (minPrice) searchCriteria.price.$gte = Number(minPrice);
      if (maxPrice) searchCriteria.price.$lte = Number(maxPrice);
    }

    const courses = await Course.find(searchCriteria)
      .populate('instructor', 'name email profileImage')
      .select('-modules');
      
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search courses', error });
  }
};

// Get user's courses with payment status
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all enrollments for the user
    const enrollments = await Enrollment.find({ student: userId })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email profileImage'
        }
      });

    // Separate paid and unpaid courses
    const paidCourses = [];
    const AllCourses = [];

    enrollments.forEach(enrollment => {
      const courseData = {
        ...enrollment.course.toObject(),
        enrollmentId: enrollment._id,
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        quizScores: enrollment.quizScores
      };

      if (enrollment.paymentStatus === 'Paid') {
        paidCourses.push(courseData);
      } else {
        AllCourses.push(courseData);
      }
    });

    res.json({
      message: "User courses fetched successfully",
      data: {
        paidCourses,
        AllCourses
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch user courses', 
      error: error.message 
    });
  }
};