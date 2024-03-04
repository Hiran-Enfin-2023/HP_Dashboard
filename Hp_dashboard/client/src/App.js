// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import "./App.css"
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    // Simulating a login check
    const checkLogin = async () => {
      try {
       const token = localStorage.getItem('access-token');
       if(token)
        setLoggedIn(true);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    // Load initial data when the component mounts
    checkLogin();
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} /> */}
          <Route
            path="/"
            element={
              !loggedIn ? (
                <div>
                  <Login setLoggedIn={setLoggedIn} />
                </div>
              ) : (
                <Dashboard isLoggedIn={loggedIn}/>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
