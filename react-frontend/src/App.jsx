import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateStudent from './pages/CreateStudent';
import ListStudents from './pages/ListStudents';
import ListCourses from './pages/ListCourses';
import CreateCourse from './pages/CreateCourse';
import RegisterPage from './pages/RegisterPage';
import Header from './pages/Header';
import Footer from './pages/Footer';

function App() {
    return (
      <UserProvider>
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-student" element={<CreateStudent />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/list-students" element={<ListStudents />} />
                <Route path="/list-courses" element={<ListCourses />} />
            </Routes>
            <Footer />
        </Router>
      </UserProvider>
    );
}

export default App
