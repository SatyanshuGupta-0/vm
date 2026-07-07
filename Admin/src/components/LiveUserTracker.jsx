import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchDataFromApi } from '../utils/api';

const LiveUserTracker = () => {
  const [count, setCount] = useState(0);

  // const pingServer = async () => {
  //   try {
  //     await axios.post('http://192.168.31.244:3000/api/activeUser/ping', { client: "user" });
  //   } catch (error) {
  //     console.error('Ping error:', error);
  //   }
  // };

  const fetchLiveUsers = async () => {
    try {
      const res = await fetchDataFromApi('/api/activeUser/live-users');
      setCount(res.liveUsers);
    } catch (error) {
      console.error('Fetch live users error:', error);
    }
  };

  useEffect(() => {
    // pingServer();
    fetchLiveUsers();

    // const pingInterval = setInterval(pingServer, 15000);
    const fetchInterval = setInterval(fetchLiveUsers, 2000); // Update every 2 sec to match 2s timeout

    return () => {
      // clearInterval(pingInterval);
      clearInterval(fetchInterval);
    };
  }, []);

  return <p className="text-lg font-semibold">{count}</p>; // styled like others
};

export default LiveUserTracker;
