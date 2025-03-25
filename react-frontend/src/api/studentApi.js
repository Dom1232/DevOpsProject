const BASE_URL = 'http://localhost:5000';

//Student Login
export const studentLogin = async (loginData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/slogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },   
            credentials: 'include',
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Student login successful:', data);
            return data;
        } else {
            console.log('Student login failed:', data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};

//Logout
export const studentLogout = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/slogout`, {
            method: 'POST',
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Student logged out:', data.message);
        } else {
            console.log('Logout failed:', data.message);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

// Student Registration
export const studentRegister = async (studentData) => {
    try {
        const response = await fetch('http://localhost:5000/auth/sregister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(studentData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Student registered:', data);
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Something went wrong' };
    }
};

