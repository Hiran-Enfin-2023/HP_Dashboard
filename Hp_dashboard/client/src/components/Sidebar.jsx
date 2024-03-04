import React, { useEffect, useState } from 'react';
const Sidebar = ({ selectedMenu, setMenu, setSelectedSession }) => {


  const [sessionList, setSessionList] = useState([]);

  const handleMenuSelect = (menu) => {
    setMenu(menu);
  };

  useEffect(() => {
    loadTranscripts();
  }, []);

  const loadTranscripts = async () => {
    try {
      const response = await fetch("http://localhost:5000/rest/sessions");
      const data = await response.json();
      setSessionList(data);
    } catch (error) {
      console.error('Error loading transcripts:', error);
    }
  };

  console.log("siderbar",sessionList);
  return (
    <div className="main">

      <div className="sidebar">

        <ul>
          <li>
            {/* <div className={selectedMenu === 'users' ? 'sidemenu active' : 'sidemenu hide'} onClick={() => handleMenuSelect('users')}>
            Visitors
          </div> */}
            <div className={selectedMenu === 'transcripts' ? 'sidemenu active' : 'sidemenu hide'} onClick={() => handleMenuSelect('transcripts')}>
              Transcripts
            </div>
          </li>
          <li>
            {
              sessionList?.map((e, index) => {
                return (
                  <div key={index} onClick={() => setSelectedSession(e)}choro className='user-list'>
                    <img style={{color:"white"}} src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTuWHsMQDsE2nC8MBb4rVU2tnwaEALHRQpaa2cmTy9Z4h7MSpgiCJsN1ml_Wh-0" alt="" srcset="" />
                    <h5 >{e}</h5>
                  </div>
                )
              })
            }
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
