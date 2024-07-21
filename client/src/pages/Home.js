import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
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
