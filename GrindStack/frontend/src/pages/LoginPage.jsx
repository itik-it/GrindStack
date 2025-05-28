import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_USER_API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Login failed');
        return;
      }

      const data = await res.json();

      // Store token, role, and session-based userId
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('role', data.role);
      sessionStorage.setItem('userId', data.userId);
      sessionStorage.setItem('username', data.username);

      // Redirect to home after login
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Could not connect to login service.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account?{' '}
        <button className="link-button" onClick={() => navigate('/signup')}>
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
