import React, { useEffect, useState } from "react";
import { IoIosSearch, IoMdArrowBack } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userConversation from "../../Zustans/useConversation";
import { useSocketContext } from "../../context/socketContext";

export const Sidebar = ({ onSelectUser }) => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { authUser, setauthUser } = useAuth();
  const navigate = useNavigate();
  const { message, selectedConversation, setSelectedConversation ,setMessages,messages} =
    userConversation();
  const { onlineUser, socket } = useSocketContext();
  const [newMessageUsers, setNewMessageUsers]=useState('');

  const nowOnline = chatUser.map((user) => user._id);

  //chats online checking funnctionality
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(()=>{
    socket?.on('newMessage',(newMessage)=>{
      setNewMessageUsers(newMessage)
    })
    return ()=> socket?.off("newMessage");
  },[socket,messages])


  //show user with you chatted
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }

        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);
  console.log(chatUser);

  //shows all users on click
  const showAllUsers = async () => {
    // e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=`);
      // const search = await axios.get(`/api/user/search?search=${''}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.loading === 0) {
        toast.info("User Not Found!");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //show user from the search result:-
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      // const search = await axios.get(`/api/user/search?search=${''}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.loading === 0) {
        toast.info("User Not Found!");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //show which user is selected
  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user?._id);
    setNewMessageUsers('')
  };

  //back from search results
  const handleSearchback = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  //logout
  const handleLogOut = async () => {
    const confirmlogout = window.prompt("type 'Username' to Logout");
    if (confirmlogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        toast.info(data.message);
        localStorage.removeItem("chatapp");
        setauthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("Logout cancelled!");
    }
  };

  console.log(searchUser);

  return (
    <div className="h-[94%] w-auto p-1 ">
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handleSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="px-4 w-auto bg-transparent outline-none rounded-full"
            placeholder="search user"
          />

          <button className="btn btn-circle bg-sky-700 hover:bg-gray-950 ">
            <IoIosSearch />
          </button>
        </form>

        <img
          onClick={() => {
            navigate(`/profile/${authUser?._id}`);
          }}
          src={`${authUser?.profilepic}`}
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer"
        />
      </div>
      <div className="divider px-3"></div>

      {/* //my written code */}
      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                      selectedUserId === user?._id ? "bg-sky-500" : ""
                    }`}
                  >
                    <div
                      className={`avatar ${isOnline[index] ? "online" : ""}`}
                    >
                      <div className="h-12 w-12 rounded-full">
                        <img src={user.profilepic} alt="user.img" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 text-white">
                      <p className="font-bold text-gray-200">{user.username}</p>
                    </div>
                  </div>
                  <div className="divider divide-solid px-3 h-[1px]"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex ">
            <button
              onClick={handleSearchback}
              className="bg-gray-700 rounded-full px-2 py-1 self-center hover:scale-105 transition-transform duration-300"
            >
              <IoMdArrowBack size={35} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div
                    className={`font-bold items-center flex flex-col text-xl text-yellow-500`}
                  >
                    <h1>Why are you Alone!!</h1>
                    <h1>Search username to chat</h1>
                  </div>
                  <div className="items-center justify-center flex mt-10 text-white">
                    <button
                      onClick={showAllUsers}
                      className="bg-gray-700 rounded p-2 hover:bg-gray-800 hover:scale-105 transition-transform duration-700"
                    >
                      Show All Users
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handleUserClick(user)}
                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                          selectedUserId === user?._id ? "bg-sky-500" : ""
                        } hover:bg-gray-700`}
                      >
                        <div
                          className={`avatar ${
                            isOnline[index] ? "online" : ""
                          }`}
                        >
                          <div className="h-12 w-12 rounded-full">
                            <img src={user.profilepic} alt="user.img" />
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="font-bold text-gray-200">
                            {user.username}
                          </p>
                        </div>
                      <div>
                        {newMessageUsers.receiverId === authUser.id && newMessageUsers.senderId === user._id?
                      <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                          +1
                        </div>:<></>
                          }
                      </div>
                      </div>
                      <div className="divider divide-solid px-3 h-[1px]"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-auto px-1 py-1 flex group relative">
            <button
              onClick={handleLogOut}
              className="hover:bg-red-500 w-10 cursor-pointer hover:text-white rounded-lg relative"
            >
              <BiLogOut size={25} />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Logout
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
