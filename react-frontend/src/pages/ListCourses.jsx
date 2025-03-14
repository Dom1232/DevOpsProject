import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import getGraphQLClient from '../api/graphqlClient';
import { useNavigate } from 'react-router-dom';
import '../css/table.css';

const GET_COURSES = `
query {
    getCourses {
        id
        code
        name
        section
        semester
    }
}
`;

const STUDENTS_IN_COURSE = `
query GetStudentsByCourse($courseId: ID!) {
    getStudentsByCourse(courseId: $courseId) {
        id
        number
        firstName
        lastName
        email
    }
}
`;

const ListCourses = () => {
    const { user } = useUser();
    const client = getGraphQLClient(user?.role);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentsInCourse, setStudentsInCourse] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);


    useEffect(() => {
        if (!user) {
            navigate('/');
        }
        const fetchCourses = async () => {
            try {
                const response = await client.request(GET_COURSES);
                setCourses(response.getCourses); 
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user]);

    const fetchStudentsInCourse = async (course) => {
        try {
            const response = await client.request(STUDENTS_IN_COURSE, { courseId: course.id });
            setStudentsInCourse(response.getStudentsByCourse);
            setSelectedCourse(course);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>List of Courses</h1>
            
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            
            <table>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Program Name</th>
                        <th>Section</th>
                        <th>Semester</th>
                        <th>Students</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <tr key={course._id}>
                                <td>{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.section}</td>
                                <td>{course.semester}</td>
                                <td>
                                    <button onClick={() => fetchStudentsInCourse(course)}>
                                        Show Students
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No courses found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {studentsInCourse.length > 0 && selectedCourse ? (
                <div className="students-list">
                    <h2>Students in {selectedCourse.code} - {selectedCourse.section} ({selectedCourse.semester})</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInCourse.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.number}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                ) : (
                <div>
                    <h2>Students in {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.section} (${selectedCourse.semester})` : ''}</h2>
                    <p>No students found</p>
                </div>
            )}
            <br />
            <button onClick={() => navigate(`/dashboard`)}>Return to Dashboard</button>
        </div>
    );
};

export default ListCourses;