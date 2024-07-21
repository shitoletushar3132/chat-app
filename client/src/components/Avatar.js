import React from "react";
import { PiUserCircle } from "react-icons/pi";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  let avatarName = "";

  if (name) {
    const splitName = name?.split("");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  return (
    <div className="text-slate-800 overflow-hidden rounded-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className="overflow-hidden rounded-full"
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}
    </div>
  );
};

export default Avatar;
