const { Module, Lesson, Quiz } = require('../model/Model');
const bunnyStorage = require('../utils/bunnycdn');

// Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    const { title, content, duration } = req.body;
    const moduleId = req.params.moduleId;
    let videoUrl = null;
    let fileName = null;
    // Set type to 'Video' if there's a video file
    const type = req.file ? 'Video' : 'Text';

    console.log('Request body:', req.body);
    console.log('File:', req.file);
    console.log('Determined type:', type); // Debug log

    //check if moduleId is valid
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Create lesson first without video
    const lesson = new Lesson({
      title,
      content,
      type, // Use the determined type
      duration,
      videoUrl
    });

    const savedLesson = await lesson.save();

    // Add lesson to module
    await Module.findByIdAndUpdate(
      moduleId,
      { $push: { lessons: savedLesson._id } }
    );

    // Handle video upload if file exists
    if (req.file) {
      console.log('Starting video upload...');
      fileName = `${Date.now()}-${req.file.originalname}`;
      
      try {
        await bunnyStorage.upload(
          req.file.buffer,
          `/lessons/${fileName}`
        );
        console.log('Video uploaded successfully');
        
        videoUrl = `${process.env.BUNNY_CDN_URL}/lessons/${fileName}`;
        console.log('Video URL:', videoUrl);
        
        // Update lesson with video URL
        savedLesson.videoUrl = videoUrl;
        await savedLesson.save();
      } catch (uploadError) {
        console.error('Video upload failed:', uploadError);
        return res.status(201).json({ 
          message: 'Lesson created but video upload failed', 
          lesson: savedLesson,
          uploadError: uploadError.message 
        });
      }
    }

    res.status(201).json({ 
      message: 'Lesson created successfully', 
      lesson: savedLesson 
    });
  } catch (error) {
    console.error('Lesson creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create lesson', 
      error: error.message 
    });
  }
};

// Update lesson
exports.updateLesson = async (req, res) => {
  try {
    const { title, content, type, duration } = req.body;
    const { lessonId } = req.params;
    let videoUrl = req.body.videoUrl; // Keep existing video if no new upload
    
    // Update lesson first without video
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        title,
        content,
        type,
        duration,
        videoUrl
      },
      { new: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Handle video upload after lesson is updated successfully
    if (type === 'Video' && req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      await bunnyStorage.upload(
        req.file.buffer,
        `/lessons/${fileName}`
      );
      videoUrl = `${process.env.BUNNY_CDN_URL}/lessons/${fileName}`;
      
      // Update lesson with new video URL
      updatedLesson.videoUrl = videoUrl;
      await updatedLesson.save();
    }

    res.json({ 
      message: 'Lesson updated successfully', 
      lesson: updatedLesson 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update lesson', 
      error 
    });
  }
};

// Delete lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { moduleId, lessonId } = req.params;

    // Remove lesson from module
    await Module.findByIdAndUpdate(
      moduleId,
      { $pull: { lessons: lessonId } }
    );

    // Delete associated quiz if exists
    const lesson = await Lesson.findById(lessonId);
    if (lesson && lesson.quiz) {
      await Quiz.findByIdAndDelete(lesson.quiz);
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(lessonId);

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete lesson', 
      error 
    });
  }
};

// Get lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId)
      .populate('quiz');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch lesson', 
      error 
    });
  }
};

// Reorder lessons in a module
exports.reorderLessons = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { lessonOrder } = req.body; // Array of lesson IDs in new order

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    module.lessons = lessonOrder;
    await module.save();

    res.json({ 
      message: 'Lessons reordered successfully', 
      module 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to reorder lessons', 
      error 
    });
  }
};

// Add quiz to lesson
exports.addQuizToLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, questions } = req.body;

    const quiz = new Quiz({
      title,
      questions
    });

    const savedQuiz = await quiz.save();

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { 
        quiz: savedQuiz._id,
        type: 'Quiz'
      },
      { new: true }
    ).populate('quiz');

    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ 
      message: 'Quiz added to lesson successfully', 
      lesson: updatedLesson 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to add quiz to lesson', 
      error 
    });
  }
}; 