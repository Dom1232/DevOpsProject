const BASE_URL = 'http://localhost:5000';

//Login - Non GraphQL
export const adminLogin = async (loginData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/alogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Admin login successful', data);
            return data;
        } else {
            console.error('Admin login failed:', data.message);
        }
    } catch (error) {
        console.error('Error during admin login:', error);
    }
};

//Logout - Non GraphQL
export const logoutAdmin = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Admin logged out:', data.message);
        } else {
            console.log('Logout failed:', data.message);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
