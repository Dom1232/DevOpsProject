import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentLogin } from '../api/studentApi';
import { adminLogin } from '../api/adminApi';
import { useUser } from '../context/userContext';
import '../css/loginPage.css';

function Login() {
    const { user, loginUser } = useUser();
    const navigate = useNavigate();
    const [isStudent, setIsStudent] = useState(true);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginFunction = isStudent ? studentLogin : adminLogin;
            const response = await loginFunction(loginData);
            
            if (response) {

                const userData = {
                    id: isStudent ? response.student.id : response.admin.id,
                    role: isStudent ? 'student' : 'admin',
                    name: isStudent ? response.student.name : 'Admin',
                };

                loginUser(userData);
                alert("Login successful!");
                navigate('/Dashboard');
            } else {
                alert("Invalid credentials, Username or Password does not match");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="container">
            <h2>{isStudent ? 'Student Login' : 'Admin Login'}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>

            <div className="action-button">
                <button onClick={() => setIsStudent(!isStudent)}>
                    {isStudent ? 'Switch to Admin Login' : 'Switch to Student Login'}
                </button>
                <button onClick={() => navigate('/register')}>
                    Register as Student
                </button>
            </div>
        </div>
    );
}

export default Login;
