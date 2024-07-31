import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);

  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
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
            onClick={() => setOpenSearchUser(true)}
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
              userId={user?._id}
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

      <div className=" w-full ">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800 ">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar ">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* edit user detail */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
