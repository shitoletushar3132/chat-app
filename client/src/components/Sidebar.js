import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);

  const [editUserOpen, setEditUserOpen] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-full h-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="Chat"
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>

          <div
            className="w-full h-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="Add friend"
          >
            <span className="ml-2">
              <FaUserPlus size={20} />
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => {
              setEditUserOpen(true);
            }}
          >
            <Avatar
              name={user?.name}
              width={40}
              height={40}
              imageUrl={user?.profile_pic}
            />
          </button>
          <button
            className="w-full h-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded -ml-2"
            title="logout"
          >
            <BiLogOut size={30} />
          </button>
        </div>
      </div>
      {/* edit user detail */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
    </div>
  );
};

export default Sidebar;
