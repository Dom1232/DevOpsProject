import React, { useState, useEffect } from 'react';
import getGraphQLClient from '../api/graphqlClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import '../css/loginPage.css';

function CreateStudent() {
    const { user } = useUser();
    const client = getGraphQLClient(user?.role);
    const navigate = useNavigate();

    const [studentData, setStudentData] = useState({
        number: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phoneNumber: '',
        email: '',
        program: '',
        favProf: '',
        favClass: '',
    });

    const ADD_STUDENT = `
    mutation CreateStudent($number: String!, $firstName: String!, $lastName: String!, $address: String!, $city: String!, $phoneNumber: String!, $email: String!, $program: String!, $favProf: String!, $favClass: String!) {
        createStudent(
            number: $number,
            firstName: $firstName,
            lastName: $lastName,
            address: $address,
            city: $city,
            phoneNumber: $phoneNumber,
            email: $email,
            program: $program,
            favProf: $favProf,
            favClass: $favClass
        ) {
            id
            number
            firstName
            lastName
            address
            city
            phoneNumber
            email
            program
            favProf
            favClass
        }
    }
    `;

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData({
            ...studentData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await client.request(ADD_STUDENT, {
                number: studentData.number,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                address: studentData.address,
                city: studentData.city,
                phoneNumber: studentData.phoneNumber,
                email: studentData.email,
                program: studentData.program,
                favProf: studentData.favProf,
                favClass: studentData.favClass,
            });
            if (response.createStudent) {
                alert('Student created successfully');
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Error creating student. Please try again.');
            console.error(err);
        }
    };


    return (
        <div className="container">
            <h2>Create Student</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                type="text"
                name="number"
                placeholder="Student Number"
                value={studentData.number}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={studentData.firstName}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={studentData.lastName}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="address"
                placeholder="Address"
                value={studentData.address}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="city"
                placeholder="City"
                value={studentData.city}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={studentData.phoneNumber}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="email"
                placeholder="Email"
                value={studentData.email}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="program"
                placeholder="Program"
                value={studentData.program}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="favProf"
                placeholder="Favourite Professor"
                value={studentData.favProf}
                onChange={handleChange}
                
                />
                <input
                type="text"
                name="favClass"
                placeholder="Favourite Class"
                value={studentData.favClass}
                onChange={handleChange}
                
                />
                <button type="submit">Create Student</button>
            </form>
            <br />
            <button onClick={() => navigate(`/dashboard`)}>Return to Dashboard</button>
        </div>
    );
}

export default CreateStudent;