import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentRegister } from '../api/studentApi';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        number: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phoneNumber: '',
        email: '',
        program: '',
        favProf: '',
        favClass: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await studentRegister(formData);
        if (result.success) {
            alert(result.message);
            navigate('/');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="container">
            <h2>Student Registration</h2>
            <form onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, value]) => (
                    <input
                        key={key}
                        type={key === 'password' ? 'password' : 'text'}
                        name={key}
                        placeholder={key}
                        value={value}
                        onChange={handleChange}
                        required={key !== 'favProf' && key !== 'favClass'}
                    />
                ))}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
