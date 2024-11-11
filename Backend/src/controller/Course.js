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
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error });
  }
};

// Get all courses with instructor details and without modules
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email role profileImage enrolledCourses')
      .select('-modules');
    res.json({message: "Courses fetched successfully", courses});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};

// Get course by ID with instructor details and modules
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
//Parchase Course
exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = req.params.courseId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
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
      paymentStatus: 'Paid' // You might want to handle this based on your payment logic
    });
    await enrollment.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId }
    });

    res.json({ message: 'Course enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to enroll in course', error });
  }
};

// get Course Enrolled by User search by user module
exports.getCourseEnrolledByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const moduleId = req.params.moduleId;

    // Find the course containing the specified module
    const course = await Course.findOne({ modules: moduleId })
      .populate('modules')
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons'
        }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: course._id
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrolled course', error });
  }
};
