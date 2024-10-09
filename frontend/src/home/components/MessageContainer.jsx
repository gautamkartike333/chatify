import React, { useEffect, useRef, useState } from "react";
import { TiMessages } from "react-icons/ti";
import userConversation from "../../Zustans/useConversation";
import { useAuth } from "../../context/AuthContext";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { useSocketContext } from "../../context/socketContext";
import notify from '../../assets/notification.mp3';


export const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();
  const [sending,setSending]=useState(false);
  const [sendData,setSendData]=useState("")
  const {socket} = useSocketContext();
  const [socketStatus, setSocketStatus] = useState({
    connected: false,
    error: null
  });

  useEffect(()=>{
    socket?.on('newMessage',(newMessage)=>{
      console.log('----Socket Connected----');
const sound = new Audio(notify);
sound.play();
setMessages([...messages,newMessage])
    })

    return ()=> socket?.off("newMessage");
  },[socket,setMessages,messages])


//
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        if(selectedConversation === null){
          return("Waiting for Id!")}
        else {const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        // console.log("============get========in megcontainer.jsx");
        
        console.log(get);
        
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.messages);
        }
        console.log(data);
        
        setLoading(false);
        setMessages(data);}
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  console.log(messages);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?._id}`,{messages:sendData});
      const data = await res.data;
      if(data.success === false){
        setSending(false);
        console.log(data.messages);
        
      }
      setSending(false);
      setSendData("")
      setMessages([...messages,data])

    } catch (error) {
      setSending(false);
      console.log(error);
    }
  }

  return (
    <div className="md:min-w-[500px] h-full flex flex-col py-2 ">
      {/* <audio src="../../assets/sound/notification."></audio> */}
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-gray-200 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">Welcome!!👋 {authUser.username}😉</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2  rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className=" md:hidden ml-1 self-center">
                <button
                  onClick={() => onBackUser(true)}
                  className="bg-white rounded-full px-2 py-1 self-center"
                >
                  <IoArrowBackSharp size={25} />
                </button>
              </div>

              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center ">
                  <img
                    className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                    src={selectedConversation?.profilepic}
                  />
                </div>
                <span className="text-gray-950 self-center text-sm  md:text-xl font-bold">
                  {selectedConversation?.fullname}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent ">
                <div className="loading loading-spinner"></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className="text-center text-white items-center">
                Send a message to start Conversation
              </p>
            )}
            {!loading &&
              messages?.length > 0 &&
              messages?.map((msg) => {
                //               let k=1;
                //               if(k==1){
                //               console.log('Message sender ID:', msg.senderId);
                //               console.log('Auth user ID:', authUser._id);
                //               console.log('Are they equal?', msg.senderId === authUser._id);}
                // k++;
                return (
                  <div
                    className="text-white"
                    key={msg?._id}
                    ref={lastMessageRef}
                  >
                    <div
                      className={`chat ${
                        msg.senderId === authUser.id ? "chat-end" : "chat-start"
                      }`}
                    >
                      <div className="chat-image avatar"></div>
                      <div
                        className={`chat-bubble text-white font-normal ${
                          msg.senderId == authUser.id
                            ? "bg-blue-600"
                            : "bg-gray-600"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div className="chat-footer text-[10px] opacity-80">
                        {new Date(msg?.createdAt).toLocaleDateString("en-IN")}
                        {new Date(msg?.createdAt).toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <form onSubmit={handleSubmit} className=" rounded-full text-black">
            <div className="w-full rounded-full flex items-center bg-white">
              <input
                value={sendData}
                required
                onChange={(e) => setSendData(e.target.value)}
                id="message"
                type="text "
                className="w-full bg-transparent outline-none px-4 rounded-full"
              />
              <button type="submit">
                {loading ? (
                  <div className="loading loading-spinner"></div>
                ) : (
                  <IoSend
                    size={25}
                    className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
