import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateStudent from './pages/CreateStudent';
import ListStudents from './pages/ListStudents';
import ListCourses from './pages/ListCourses';
import CreateCourse from './pages/CreateCourse';

function App() {
    return (
      <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-student" element={<CreateStudent />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/list-students" element={<ListStudents />} />
                <Route path="/list-courses" element={<ListCourses />} />
            </Routes>
        </Router>
      </UserProvider>
    );
}

export default App
