import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../api/adminApi';
import { studentLogout } from '../api/studentApi';
import getGraphQLClient from '../api/graphqlClient';
import '../css/dashboard.css';


const LIST_ENROLL_COURSES = `
  query {
    listEnrollCourses {
      id
      code
      name
      section
      semester
    }
  }
`;

const GET_COURSES_BY_STUDENT = `
  query GetCoursesByStudent($studentId: ID!) {
    getCoursesByStudent(studentId: $studentId) {
      id
      code
      name
      section
      semester
    }
  }
`;

const ADD_COURSE_TO_STUDENT = `
  mutation AddCourseToStudent($studentId: ID!, $courseId: ID!) {
    addCourseToStudent(studentId: $studentId, courseId: $courseId) {
      id
      code
      name
      section
      semester
    }
  }
`;

const UPDATE_COURSE = `
  mutation UpdateCourse($studentId: ID!, $courseId: ID!, $section: Int!) {
    updateCourse(studentId: $studentId, courseId: $courseId, section: $section) {
        newCourse {
            code
        }
    }
  }
`;

const DROP_COURSE = `
  mutation DropCourse($studentId: ID!, $courseId: ID!) {
    dropCourse(studentId: $studentId, courseId: $courseId) {
      id
      code
      name
      section
      semester
    }
  }
`;

const GET_OPEN_COURSES = `
  query GetOpenCourses($code: String!) {
    getOpenCourses(code: $code) {
      id
      code
      name
      section
      semester
    }
  }
`;

function Dashboard () {
    const { user } = useUser();
    const client = getGraphQLClient(user?.role);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [enrollCourses, setEnrollCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [availableSections, setAvailableSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        if (user) {
            setLoading(false);
            if (user.role === 'student') {
                fetchStudentCourses();
                fetchEnrollCourses();
            }
        } else {
            navigate('/');
        }
    }, [user]);

    //Enrolling
    const fetchEnrollCourses = async () => {
        try {
            const response = await client.request(LIST_ENROLL_COURSES);
            setEnrollCourses(response.listEnrollCourses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCourseChange = (e) => {
        const selectedCourseId = e.target.value;
        const selected = enrollCourses.find(course => course.id === selectedCourseId);
        setSelectedCourse(selected);
    };

    const handleEnroll = async () => {
        if (selectedCourse) {
            try {
                await client.request(ADD_COURSE_TO_STUDENT, { studentId: user.id, courseId: selectedCourse.id });
                console.log('Successfully enrolled in the course!');
                fetchStudentCourses();
            } catch (error) {
                console.error('Error enrolling in course:', error);
            }
        } else {
            console.log('Please select a course to enroll in.');
        }
    };

    //Student management
    const fetchStudentCourses = async () => {
        try {
            const data = await client.request(GET_COURSES_BY_STUDENT, { studentId: user.id });
            setCourses(data.getCoursesByStudent || []);
        } catch (error) {
            console.error('Error fetching student courses:', error);
        }
    };

    const handleLogout = async (userType) => {
        try {
            const confirmation = window.confirm("Are you sure you want to logout?");
            if (confirmation) {
                if (userType === "admin") {
                    

                    await logoutAdmin();
                } else if (userType === "student") {
                    await studentLogout();
                }
                console.log("Logged out successfully");
                navigate("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleEditCourse = async (courseCode) => {
        setEditingCourse(courseCode);
        try {
            const response = await client.request(GET_OPEN_COURSES, { code: courseCode});
            setAvailableSections(response.getOpenCourses || []);
        } catch (error) {
            console.error('Error fetching available sections:', error);
        }
    };

    const handleSectionChange = (e) => {
        setSelectedSection(e.target.value);
    };

    const handleUpdateCourse = async (courseId) => {
        if (!selectedSection) {
            alert('Please select a section');
            return;
        }
    
        try {
            await client.request(UPDATE_COURSE, { studentId: user.id, courseId, section: parseInt(selectedSection, 10) });
            console.log('Successfully updated your section');
            setEditingCourse(null);
            setAvailableSections([]);
            
            fetchStudentCourses();
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    const handleDropCourse = async (courseId) => {
        const confirmDrop = window.confirm('Are you sure you want to drop this course?');
    
        if (confirmDrop) {
            try {
                await client.request(DROP_COURSE, { studentId: user.id, courseId: courseId });
    
                fetchStudentCourses();
            } catch (error) {
                console.error('Error dropping course:', error);
            }
        } else {
            console.log('Course drop canceled.');
        }
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
        setAvailableSections([]);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>{user.role === 'student' ? 'Student Dashboard' : 'Admin Dashboard'}</h1>
            <p>Welcome, {user.name}</p>

            <div>
                {user.role === 'student' ? (
                    <div>
                        <button className='logout' onClick={() => handleLogout("student")}>Logout</button>
                        <br/><br/>
                        <select value={selectedCourse ? selectedCourse.id: ''} onChange={handleCourseChange}>
                            <option value="">Select a course</option>
                            {enrollCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.code}-{course.section}-{course.name}-{course.semester}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleEnroll} disabled={!selectedCourse}>
                            Enroll
                        </button>
                        <h3>Your Classes</h3>

                        {courses.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Section</th>
                                        <th>Semester</th>
                                        <th>Change Section</th>
                                        <th>Drop Course</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id}>
                                            <td>{course.code}</td>
                                            <td>{course.name}</td>
                                            <td>
                                                {editingCourse === course.code ? (
                                                    <select value={selectedSection} onChange={handleSectionChange}>
                                                        <option value="">Select a section</option>
                                                        {availableSections.map(section => (
                                                            <option key={section.section} value={section.section}>
                                                                {section.section}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    course.section
                                                )}
                                            </td>
                                            <td>{course.semester}</td>
                                            <td>
                                                {editingCourse === course.code ? (
                                                    <>
                                                        <button onClick={() => handleUpdateCourse(course.id)}>Update</button>
                                                        <button className='cancel' onClick={handleCancelEdit}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleEditCourse(course.code)}>Edit</button>
                                                )}
                                            </td>
                                            <td>
                                                <button className='cancel' onClick={() => handleDropCourse(course.id)}>Drop</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No courses enrolled.</p>
                        )}
                        
                    </div>
                ) : (
                    <div>
                        <button onClick={() => navigate(`/create-student`)}>Create New Student Account</button>
                        <br/><br/>
                        <button onClick={() => navigate(`/create-course`)}>Create New Course</button>
                        <br/><br/>
                        <button onClick={() => navigate(`/list-students`)}>View All Students</button>
                        <br/><br/>
                        <button onClick={() => navigate(`/list-courses`)}>View All Courses</button>
                        <br/><br/>
                        <button className='logout' onClick={() => handleLogout("admin")}>Logout</button>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default Dashboard;