import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa";
import uploadFile from "../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import backgroundImage from "../assets/wallapaper.jpeg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadPhoto = await uploadFile(file);
      setMessage((prev) => ({ ...prev, imageUrl: uploadPhoto.url }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadVideo = await uploadFile(file);
      setMessage((prev) => ({ ...prev, videoUrl: uploadVideo.url }));
    } catch (error) {
      console.error("Video upload failed:", error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({ text: "", imageUrl: "", videoUrl: "" }); // Clear message after sending
      }
    }
  };

  const handleOnChange = (e) => {
    setMessage((prev) => ({ ...prev, text: e.target.value }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params.userId, user]);

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover h-screen"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <Avatar
            width={50}
            height={50}
            imageUrl={dataUser?.profile_pic}
            name={dataUser?.name}
            userId={dataUser?._id}
          />
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div className="cursor-pointer hover:text-primary">
          <button>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll relative bg-slate-200 bg-opacity-50">
        {/* all messages show here */}
        <div ref={currentMessage} className="flex flex-col gap-2 py-2 mx-1">
          {allMessage.map((msg, index) => {
            return (
              <div
                className={`bg-white p-1 py-1 w-fit rounded  max-w-[250px] md:max-w-sm lg:max-w-md ${
                  user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : ""
                }`}
              >
                <div className="w-full">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}

                  {msg?.videoUrl && (
                    <video
                      src={msg?.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh.mm")}
                </p>
              </div>
            );
          })}
        </div>
        {message.imageUrl && (
          <div className="sticky bottom-0 inset-0 flex justify-center items-center bg-slate-700 bg-opacity-30 rounded">
            <div
              className="absolute top-2 right-2 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="Uploaded"
                className="object-contain max-w-full max-h-full"
              />
            </div>
          </div>
        )}
        {message.videoUrl && (
          <div className="sticky bottom-0  inset-0 flex justify-center items-center bg-slate-700 bg-opacity-30 rounded">
            <div
              className="absolute top-2 right-2 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="object-contain max-w-full max-h-full"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      <section className="h-16 bg-white flex items-center px-4 border-t">
        <div className="relative flex items-center w-full">
          <button
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
            onClick={handleUploadImageVideoOpen}
          >
            <FaPlus size={20} />
          </button>
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-16 left-20 transform -translate-x-1/2 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <FaImage size={18} className="text-primary" />
                  <p>Image</p>
                  <input
                    type="file"
                    id="uploadImage"
                    className="hidden"
                    onChange={handleUploadImage}
                  />
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <FaVideo size={18} className="text-purple-500" />
                  <p>Video</p>
                  <input
                    type="file"
                    id="uploadVideo"
                    className="hidden"
                    onChange={handleUploadVideo}
                  />
                </label>
              </form>
            </div>
          )}
          <form
            className="h-full w-full flex gap-2 ml-2"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="py-1 px-4 outline-none w-full h-full border rounded"
              value={message.text}
              onChange={handleOnChange}
            />
            <button type="submit" className="text-primary hover:text-secondary">
              <IoMdSend size={28} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default MessagePage;
