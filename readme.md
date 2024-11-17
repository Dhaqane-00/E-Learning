# E-Learning Management System

A comprehensive Learning Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform provides a robust solution for online education, featuring course management, user authentication, content delivery, and learning progress tracking.

## 🌟 Features

### Core Functionality
- Course creation and management
- User authentication and authorization
- Content organization (Courses → Modules → Lessons)
- Progress tracking
- Interactive learning interface

### User Management
- Role-based access (Admin, Instructor, Student)
- Google OAuth integration
- Profile customization
- Course enrollment tracking

### Course Features
- Video content delivery via BunnyCDN
- Course categorization and tagging
- Advanced search functionality
- Progress monitoring
- Interactive assessments

### Technical Features
- Responsive design
- Dark mode support
- Real-time updates
- Secure file handling
- API security implementation

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & Passport
- **Storage**: BunnyCDN

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Router**: React Router DOM

### Additional Tools
- Framer Motion (animations)
- React Hot Toast (notifications)
- Axios (API calls)
- ESLint (code quality)
- Multer (file uploads)

## 📦 Project Structure

project/
├── Backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ └── utils/
│ ├── server.js
│ └── package.json
│
└── Frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── store/
│ ├── config/
│ └── assets/
├── index.html
└── package.json

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- BunnyCDN account

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BUNNY_STORAGE_API_KEY=your_bunny_key
BUNNY_STORAGE_ZONE_NAME=your_zone_name
BUNNY_CDN_URL=your_cdn_url
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Secure file upload
- Input validation
- CORS configuration
- Rate limiting

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses/create` - Create course
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/courses` - Get user's courses

## 🎨 Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/courses` - Course listing
- `/courses/:id` - Course details
- `/profile` - User profile
- `/dashboard` - User dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## 👥 Authors

- Your Name - Initial work - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
```

This unified README provides a comprehensive overview of your entire project, making it easier for developers to understand and work with both the frontend and backend components. It includes all necessary setup instructions, available features, API documentation, and contribution guidelines.

You can customize the content further based on your specific project needs, such as adding more detailed setup instructions, troubleshooting guides, or specific configuration requirements.

