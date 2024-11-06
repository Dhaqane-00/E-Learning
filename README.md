# E-Learning Management System API

A robust and scalable Learning Management System (LMS) backend built with Node.js, Express, and MongoDB. This API provides comprehensive features for course management, user authentication, content delivery, and learning progress tracking.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Instructor, Student)
- Google OAuth integration
- Secure password hashing with bcrypt

### User Management
- User registration and profile management
- Profile image upload with BunnyCDN
- Role-based permissions
- User profile customization

### Course Management
- Complete CRUD operations for courses
- Course categorization and tagging
- Advanced course search functionality
- Course thumbnail management with CDN integration

### Content Organization
- Hierarchical content structure (Courses → Modules → Lessons)
- Multiple content types support (Video, Text, Quiz)
- Content reordering capabilities
- Video content delivery through BunnyCDN

### Assessment System
- Quiz creation and management
- Question bank functionality
- Score tracking
- Progress monitoring

## 🛠️ Technical Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)

### Storage & Media
- **CDN**: BunnyCDN
- **File Upload**: Multer

### Security
- **Password Hashing**: bcrypt
- **API Security**: helmet, cors
- **Environment Variables**: dotenv

## 📦 Project Structure 

├── src/
│ ├── controllers/
│ │ ├── User.js
│ │ ├── Course.js
│ │ ├── CourseModule.js
│ │ └── Lesson.js
│ ├── middleware/
│ │ ├── auth.js
│ │ └── upload.js
│ ├── models/
│ │ └── Model.js
│ ├── routes/
│ │ ├── userRouter.js
│ │ ├── courseRouter.js
│ │ ├── moduleRouter.js
│ │ └── lessonRouter.js
│ └── utils/
│ └── bunnycdn.js
├── server.js
├── package.json
└── README.md

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- BunnyCDN account
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory:

### env
- MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BUNNY_STORAGE_API_KEY=your_bunny_api_key
BUNNY_STORAGE_ZONE_NAME=your_storage_zone
BUNNY_CDN_URL=your_cdn_url

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/lms-backend.git
cd lms-backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

http
POST /api/users/register
POST /api/users/login
GET /api/users/profile
PUT /api/users/profile

### Course Endpoints

http
POST /api/courses/create
GET /api/courses
GET /api/courses/:id
PUT /api/courses/update/:id
DELETE /api/courses/delete/:id
GET /api/courses/search

### Module Endpoints

http
POST /api/modules/course/:courseId/module
PUT /api/modules/module/:moduleId
DELETE /api/modules/course/:courseId/module/:moduleId
GET /api/modules/module/:moduleId
PUT /api/modules/course/:courseId/reorder-modules

### Lesson Endpoints

http
POST /api/lessons/module/:moduleId/lesson
PUT /api/lessons/lesson/:lessonId
DELETE /api/lessons/module/:moduleId/lesson/:lessonId
GET /api/lessons/lesson/:lessonId
PUT /api/lessons/module/:moduleId/reorder-lessons
POST /api/lessons/lesson/:lessonId/quiz

## 🔐 Security

- Implements JWT for secure authentication
- Password hashing using bcrypt
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- CORS configuration
- Rate limiting for API endpoints

## 🔄 Error Handling

The API implements a consistent error handling pattern:
- Validation errors
- Authentication errors
- Authorization errors
- Resource not found errors
- Server errors

## 🚀 Deployment 

### Production Considerations
- Set appropriate environment variables
- Configure MongoDB indexes
- Set up proper logging
- Implement rate limiting
- Configure CORS appropriately
- Set up monitoring and analytics

### Recommended Hosting Platforms
- AWS
- Heroku
- DigitalOcean
- MongoDB Atlas (for database)

## 📈 Future Improvements

- [ ] Implement real-time notifications using WebSocket
- [ ] Add payment gateway integration
- [ ] Implement caching layer
- [ ] Add analytics dashboard
- [ ] Implement course completion certificates
- [ ] Add support for live sessions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 👥 Authors

- Abdilaahi Mowliid - Initial work - [Github](https://github.com/Dhaqane-00)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc


This README provides:
Clear project overview
Detailed feature list
Technical stack information
Setup instructions
API documentation
Security considerations
Future improvements
Contributing guidelines
It's designed to help new developers quickly understand and start working with the project while providing enough technical detail for experienced developers to understand the system architecture and deployment requirements.
