import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const Signup = () => {
  const [UID, setUID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        UID,
        firstName,
        lastName,
        middleName,
        email,
        password
      };
      
      const response = await axios.post('http://localhost:1337/addusermongo', userData);
      
      console.log('User registered:', response.data);
      setMessage('Sign Up Successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error registering user:', err);
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <img src="/src/assets/login-hero.png" alt="SMU" />
        </div>
        <div className="signup-right">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input
              type="number"
              placeholder="User ID"
              value={UID}
              onChange={(e) => setUID(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
          {message && <p className="signup-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;