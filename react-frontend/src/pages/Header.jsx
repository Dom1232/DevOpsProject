import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/userContext';
import './HeaderFooter.css';

const Header = () => {
  const { user, logoutUser } = useUser();

  return (
    <header className="header">
      <h1>Student Course System</h1>
      <nav>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span>Welcome, {user.name}</span>
            <button onClick={logoutUser}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
