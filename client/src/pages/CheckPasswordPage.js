import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";
import Avatar from "../components/Avatar";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return { ...preve, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/password`;
    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message);

      if (response?.data?.success) {
        setData({
          password: "",
        });

        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="mt-5 p-1">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <Avatar />
        </div>

        <h3>Welcome to Chat app</h3>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white ">
            Let's GO
          </button>
        </form>

        <p className="my-3 text-center">
          New User ?{" "}
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
