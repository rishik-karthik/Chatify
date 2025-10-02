import React, { useState, useEffect, useMemo, useRef } from 'react'
import defaultAvatar from '/assets/user_profile_default.jpg'
import { formatTimestamp } from '../utils/formatTimestamp'
import { RiSendPlaneFill } from 'react-icons/ri'
import logo from '/assets/chatLogo.jpg'
import { messageData } from "../data/messageData"
import { auth, listenForMessages, sendMessage } from '../firebase/firebase'
const Chatbox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, sendMessageText] = useState("");
  const scrollRef = useRef(null);
  const chatId = auth?.currentUser?.uid < selectedUser?.uid ? `${auth?.currentUser?.uid} - ${selectedUser?.uid}` : `${selectedUser?.uid} - ${auth?.currentUser?.uid}`;
  const senderEmail = auth?.currentUser?.email;
  const user1 = auth?.currentUser;
  const user2 = selectedUser;
  // to update messages when re rendered
  useEffect(() => {
    listenForMessages(chatId, setMessages);
  }, [chatId]);

  //set scroll bar to curr msg
  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  const sortedMessages = useMemo(() => {
    if (!messages) return [];

    return [...messages].sort((a, b) => {
      const aTime = (a.timestamp?.seconds ?? 0) * 1000 + (a.timestamp?.nanoseconds ?? 0) / 1e6;
      const bTime = (b.timestamp?.seconds ?? 0) * 1000 + (b.timestamp?.nanoseconds ?? 0) / 1e6;

      return bTime < aTime;
    });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const newMessage = {
      sender: senderEmail,
      text: messageText,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
      },
    };
    sendMessage(messageText, chatId, user1?.uid, user2?.uid);
    setMessages((prevMessages) => {
      return (
        [...prevMessages, newMessage]
      )
    });
    sendMessageText("");
  }
  return (
    // top panel
    <>
      {selectedUser ? (<section className='flex flex-col items-start h-screen w-[100%] bg-image '>
        <header className='border-b border-gray-400 w-[100%] h-[82px] m:h-fit p-4 bg-white'>
          <main className='flex flex-row items-center gap-3'>
            <span>
              <img src={selectedUser?.image || defaultAvatar} className='w-11 h-11 object-cover rounded-full' alt="avatar" />
            </span>
            <span>
              <h3 className='font-semibold text-[#23d39] text-lg'>{selectedUser?.fullname || "Unknown user"}</h3>
              <p className='font-light text-[#23d39] text-sm'>@{selectedUser?.username || "user"}</p>
            </span>
          </main>
        </header>

        <main className='custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between'>
          {/* message section */}
          <section className='px-3 pt-5 b-20 lg:pb-10'>
            <div ref={scrollRef} className='overflow-auto h-[80vh]'>
              {/* message */}
              {
                sortedMessages?.map((msg, index) => (
                  <>
                    {msg?.sender === senderEmail ? <div className='flex flex-col items-end w-full mb-5'>
                      <span className='flex gap-3 me-10 h-auto ms-10'>
                        <p className='text-gray-400 text-xs text-right'>{formatTimestamp(msg.timestamp)}</p>
                        <div className='flex items-center bg-white justify-center p-6 rounded-lg shadow-sm'>
                          <h4 className='font-semibold text-[#23d39] text-m'>{msg?.text}</h4>
                        </div>
                      </span>
                    </div> : <div className='flex flex-col items-start w-full mb-5'>
                      <span className='flex  gap-3 w-[40%] h-auto ms-10'>
                        <img src={defaultAvatar} className='h-11 w-11 object-cover rounded-full' alt="user img" />
                        <div className='flex items-center bg-white justify-center p-6 rounded-lg shadow-sm'>
                          <h4 className='font-semibold text-[#23d39] text-m'>{msg?.text}</h4>
                        </div>
                      </span>
                      <p className='ms-[70px] text-gray-400 text-xs text-right'>{formatTimestamp(msg.timestamp)}</p>
                    </div>
                    }
                  </>
                ))
              }
            </div>
          </section>
          {/* input box */}
          <div className='sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-[100%]'>
            <form onSubmit={handleSendMessage} action="" className='flex items-center bg-white h-[45px] w-[100%] rounded-lg relative shadow-lg'>
              <input value={messageText} onChange={(e) => sendMessageText(e.target.value)} type="text" className='h-full text-[#2a3d39] outline-none text-[16px] pl-5 pr-[50px] rounded-lg w-[100%]' placeholder='write your Message...' />
              <button type='submit' className='flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#d0f2ed] hover:bg-[#c8eae3]'>
                <RiSendPlaneFill color='#01aa85' />
              </button>
            </form>
          </div>
        </main>
      </section>) :
        (<section className='h-screen w-[100%] bg-[#e5f6f3]'>
          <div className='flex flex-col justify-center items-center h-[100vh]'>
            <img src={logo} alt="" className='rounded-full w-[100px]' />
            <h1 className='text-[30px] font-bold text-teal-700 mt-5'>Welcome to Chatify</h1>
            <p>Connect and Chat with friends & family</p>
            <p className='p-0 font-light text-[#2a3d39] text-[15px]'>&copy; Rishik Karthik</p>
          </div>
        </section>)}
    </>
  )
}

export default Chatbox
