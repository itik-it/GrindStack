import React, { useState } from 'react';
import './login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState(''); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:1337/loginmongo', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),  
      });

      const data = await res.json();

      if (res.status === 200) {
        setMessage(`Welcome, ${data.user.firstName}!`);
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');  
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage(data.message || 'Invalid Email or Password');
      }        
    } catch (err) {
      console.error(err);
      setMessage('Server Error');
      setMessageColor('red');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img src="./src/assets/login-hero.png" alt="SMU" />
        </div>
        <div className="login-right">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
