const { Course, Module, Lesson } = require('../model/Model');

// Create a new module
exports.createModule = async (req, res) => {
  try {
    const { title, description } = req.body;
    const courseId = req.params.courseId;

    const module = new Module({
      title,
      description,
      lessons: []
    });

    const savedModule = await module.save();

    // Add module to course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { modules: savedModule._id } }
    );

    res.status(201).json({ message: 'Module created successfully', module: savedModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create module', error });
  }
};

// Update module
exports.updateModule = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { moduleId } = req.params;

    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      { title, description },
      { new: true }
    ).populate('lessons');

    if (!updatedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json({ message: 'Module updated successfully', module: updatedModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update module', error });
  }
};

// Delete module
exports.deleteModule = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;

    // Remove module from course
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { modules: moduleId } }
    );

    // Delete all lessons in the module
    const module = await Module.findById(moduleId);
    if (module && module.lessons.length > 0) {
      await Lesson.deleteMany({ _id: { $in: module.lessons } });
    }

    // Delete the module
    await Module.findByIdAndDelete(moduleId);

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete module', error });
  }
};

// Get module by ID
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId)
      .populate('lessons');

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch module', error });
  }
};

// Reorder modules in a course
exports.reorderModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleOrder } = req.body; // Array of module IDs in new order

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.modules = moduleOrder;
    await course.save();

    res.json({ message: 'Modules reordered successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder modules', error });
  }
};
