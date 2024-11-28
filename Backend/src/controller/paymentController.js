const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Course, Enrollment } = require('../model/Model');

const paymentController = {
  // Create payment intent
  createPaymentIntent: async (req, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.user.id; // Assuming you have auth middleware

      // Get course details
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: course.price * 100, // Stripe expects amount in cents
        currency: 'usd',
        metadata: {
          courseId,
          userId
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Payment intent error:', error);
      res.status(500).json({ message: 'Error creating payment intent' });
    }
  },

  // Handle successful payment
  handlePaymentSuccess: async (req, res) => {
    try {
      const { paymentIntentId, courseId } = req.body;
      const userId = req.user.id;

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not successful' });
      }

      // Create payment record
      const payment = await Payment.create({
        student: userId,
        course: courseId,
        amount: paymentIntent.amount / 100, // Convert back from cents
        stripePaymentId: paymentIntentId,
        status: 'succeeded'
      });

      // Update enrollment status
      await Enrollment.findOneAndUpdate(
        { student: userId, course: courseId },
        { paymentStatus: 'Paid' }
      );

      res.json({ success: true, payment });
    } catch (error) {
      console.error('Payment success handler error:', error);
      res.status(500).json({ message: 'Error processing payment success' });
    }
  },

  // Get payment history for a user
  getPaymentHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const payments = await Payment.find({ student: userId })
        .populate('course', 'title price')
        .sort('-createdAt');

      res.json(payments);
    } catch (error) {
      console.error('Payment history error:', error);
      res.status(500).json({ message: 'Error fetching payment history' });
    }
  }
};

module.exports = paymentController; 