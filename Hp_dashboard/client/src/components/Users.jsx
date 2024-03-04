import React, { useEffect, useState } from 'react';
import "../App.css"
import axios from "axios"
const Users = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('access-token');

      if (!token) {
        console.error('JWT token not found in localStorage');
        return;
      }

      const response = await axios.get('http://localhost:5000/rest/fetch-users', {
        headers: {
          Authorization: token 
        },

      });

      if (response.status === 200) {
        // console.log(response.data?.results);
        const data = await response?.data
        setUserList(data.results);
      }


    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  return (
    <section className="middle-sections" id="users">
      <h3 className="dash-head">Visitors</h3>
      <div id="userList">
        <table id="visitors" className="display" style={{ width: '100%' }}>
          {/* Render table headers here */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Product Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id}>
                {/* Render user data here */}
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.productName}</td>
                <td>{new Date(user.date).toLocaleString()}</td>
                <td>
              
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Users;
