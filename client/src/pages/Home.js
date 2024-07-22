import axios from "axios";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/user-details`;
      const response = await axios.get(URL, {
        withCredentials: true,
      });
      console.log("current user Detail ", response);
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div>
      Home
      {/* message Component */}
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
