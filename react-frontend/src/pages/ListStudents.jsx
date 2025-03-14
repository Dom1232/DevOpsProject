import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import getGraphQLClient from '../api/graphqlClient';
import { useNavigate } from 'react-router-dom';
import '../css/table.css';

const GET_STUDENTS = `
query {
    getStudents {
        id
        number
        firstName
        lastName
        email
        program
        favProf
        favClass
    }
}
`;

const ListStudents = () => {
    const { user } = useUser();
    const client = getGraphQLClient(user?.role);
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

  
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
        const fetchStudents = async () => {
            try {
                const response = await client.request(GET_STUDENTS);
                setStudents(response.getStudents); 
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchStudents();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
        <h1>List of Students</h1>
        
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        
            <table>
                <thead>
                <tr>
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>Favourite Professor</th>
                    <th>Favourite Class</th>

                </tr>
                </thead>
                <tbody>
                {students.length > 0 ? (
                    students.map((student) => (
                    <tr key={student.number}>
                        <td>{student.number}</td>
                        <td>{student.firstName} {student.lastName}</td>
                        <td>{student.email}</td>
                        <td>{student.program}</td>
                        <td>{student.favProf}</td>
                        <td>{student.favClass}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="3">No students found</td>
                    </tr>
                )}
                </tbody>
            </table>
            <br />
            <button onClick={() => navigate(`/dashboard`)}>Return to Dashboard</button>
        </div>
    );
};

export default ListStudents;