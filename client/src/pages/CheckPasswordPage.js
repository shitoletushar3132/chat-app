import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, [navigate, location]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const URL = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/password`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: { userId: location?.state?._id, password: data.password },
        withCredentials: true,
      });


      if (response?.data?.success) {
        toast.success(response?.data?.message);
        dispatch(setToken({ token: response?.data?.token }));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("API Error: ", error);
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="mt-5 p-1">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex flex-col justify-center items-center">
          <Avatar
            width={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
            height={70}
          />

          <h2 className="font-semibold mt-1 text-lg">
            {location?.state?.name}
          </h2>
        </div>

        <h3>Welcome to Chat app</h3>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white ">
            Login
          </button>
        </form>

        <p className="my-3 text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold"
          >
            Forgot Password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
