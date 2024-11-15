import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Route, Routes } from 'react-router-dom'
import AllContributers from './pages/AllContributers'
import AllCourses from './pages/AllCourses'
import AddCoursePage from './pages/AddCoursePage'
import FullCoursePage from './pages/FullCoursePage'
import Layout from './pages/Layout'
import About from './pages/About'
import VoteResources from './pages/VoteResources'
import MyProfile from './pages/MyProfile'
import {WindowWidthProvider} from './context/WindowWidthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Toaster } from 'react-hot-toast'
import CoursesUploadedByUser from './pages/CoursesUploadedByUser.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <WindowWidthProvider>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path='/' element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='contributors' element={<AllContributers />} />
            <Route path='all-courses' element={<AllCourses />} />
            <Route path='about' element={<About />} />
            <Route path='vote-resources' element={<VoteResources />} />
            <Route path='user/:userId/uploaded-courses' element={<CoursesUploadedByUser />} />

            {/* Protected Routes */}
            <Route 
              path='course/create' 
              element={
                <ProtectedRoute>
                  <AddCoursePage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path='course/:id' 
              element={
                <ErrorBoundary>
                  <FullCoursePage />
                </ErrorBoundary>
              } 
            />

            <Route 
              path='my-profile' 
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Error Route */}
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </WindowWidthProvider>
  )
}

export default App
