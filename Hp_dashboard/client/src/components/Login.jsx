import React, { useState } from 'react';
import "./Login.css"
import { useNavigate } from 'react-router-dom';
const Login = ({ setLoggedIn }) => {
  const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/rest/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });


            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setLoggedIn(true);
                navigate("/")
                localStorage.setItem('access-token', data.results.access_token)
            } else {
                // Handle login failure, show error message or redirect
                console.error('Login failed:', response.message);
            }
        } catch (error) {
            console.error('Error submitting login:', error);
        }
    };

    return (
        <div id="login-container" style={{display: "block"}}>
        <div className="login-box">
          <h1>Welcome Back!</h1>
          <form id="login-form">
            <div className="input-field">
  
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                value={formData.username}
                placeholder="Username"
              />
            </div>
            <div className="input-field">
  
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Email"
              />
            </div>
            <div className="input-field">
  
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Password"
              />
            </div>
           
            <button onClick={handleSubmit} type="submit">Login</button>
          </form>
  
        </div>
      </div>
    );
};

export default Login;
