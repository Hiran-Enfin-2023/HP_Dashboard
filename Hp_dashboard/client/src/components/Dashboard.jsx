import React, { useEffect, useState } from 'react';
import Users from './Users';
import Transcripts from './Transcripts';
import "../App.css"
import Sidebar from './Sidebar';
const Dashboard = ({ isLoggedIn }) => {
  const [menu, setMenu] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  useEffect(() => {
    if (isLoggedIn) {
      setMenu('transcripts');
    } else {
      // Redirect to the login page if not authenticated
      window.location.href = '/login';
    }
  }, [isLoggedIn]);

  return (
    <div>
      <Sidebar selectedMenu={menu} setMenu={setMenu} setSelectedSession={setSelectedSession} />
      <div className="content">
        {menu === 'users' && <Users />}
        {menu === 'transcripts' && <Transcripts selectedSession={selectedSession}/>}
      </div>
    </div>
  );
};

export default Dashboard;
