import React, { useState, useEffect } from 'react';
import getGraphQLClient from '../api/graphqlClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import '../css/loginPage.css';

function CreateCourse() {
    const { user } = useUser();
    const client = getGraphQLClient(user?.role);
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState({
        code: '',
        name: '',
        section: '',
        semester: 'Fall 2025',
    });

    const ADD_COURSE = `
    mutation CreateCourse($code: String!, $name: String!, $section: Int!, $semester: String!) {
        createCourse(
            code: $code,
            name: $name,
            section: $section,
            semester: $semester
        ) {
            id
            code
            name
            section
            semester
        }
    }
    `;

    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {   
            const response = await client.request(ADD_COURSE, {
                code: courseData.code,
                name: courseData.name,
                section: parseInt(courseData.section, 10),
                semester: courseData.semester,
            });

            if (response.createCourse) {
                alert('Course created successfully');
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Error creating course. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Create Course</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="code"
                    placeholder="Course Code"
                    value={courseData.code}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Course Name"
                    value={courseData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="section"
                    placeholder="Section"
                    value={courseData.section}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="semester"
                    value={courseData.semester}
                    readOnly
                />
                <button type="submit">Create Course</button>
            </form>
            <br />
            <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
        </div>
    );
}

export default CreateCourse;