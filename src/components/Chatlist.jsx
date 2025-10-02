import React, { useState, useEffect, useMemo } from 'react'
import defaultAvatar from '/assets/user_profile_default.jpg'
import { RiMore2Fill } from 'react-icons/ri'
import SearchModal from './SearchModal'
import { FaCircle, FaBell } from 'react-icons/fa'
import { formatTimestamp } from '../utils/formatTimestamp'

import chatData from '../data/chats'
import { auth, db, listenForChats } from '../firebase/firebase'
import { doc, onSnapshot } from 'firebase/firestore'


const Chatlist = ({ setSelectedUser }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userDocref = doc(db, "user", auth?.currentUser?.uid)
    const unsubscribe = onSnapshot(userDocref, (doc) => {
      setUser(doc.data());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);

    return () => {
      unsubscribe();
    }
  }, []);

  // cache
  const sortedChats = useMemo(() => {
    if (!chats) return [];

    return [...chats].sort((a, b) => {
      const aTime = (a.lastSeen?.seconds ?? 0) * 1000 + (a.lastSeen?.nanoseconds ?? 0) / 1e6;
      const bTime = (b.lastSeen?.seconds ?? 0) * 1000 + (b.lastSeen?.nanoseconds ?? 0) / 1e6;

      return bTime - aTime;
    });
  }, [chats]);

  const startChat = (user) => {
    setSelectedUser(user)
  }
  return (
    //curr user(hidden in sm)
    <section className='relative hidden lg:flex flex-col line-start justify-start bg-white h-[100vh] w-[100%] md:w-[600px]'>
      <header className='flex justify-between align-cente w-[100%] h-[82px] lg:border-b border-b-1 border-[#898989b9] p-3 sticky md:static top-0 z-[100]'>
        <main className='flex items-center gap-3'>
          <img src={defaultAvatar} className='w-[64px] h-[64px] object-cover' alt="userImg" />
          <span>
            <h3 className='p-0 font-semibold text-[#2a3d39] md:text-17px'>{user?.fullname || "unknown"}</h3>
            <p className='p-0 font-light text-[#2a3d39] text-[15px]'>@{user?.username || 'user'}</p>
          </span>
        </main>
        {/* more button */}
        <button className='bg-[#d9f2ed] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg'>
          <RiMore2Fill color='#01AA85' className='w-[28px] h-[28px]' />
        </button>
      </header>
      {/* notification icon */}
      <div className='w-[100%] mt-[10px] px-5'>
        <header className='flex items-center justify-between'>
          <h3 className='relative inline-block text-3xl'>
            <FaCircle color='#01AA85' />
            <FaBell className="absolute top-0 left-0 text-white" />
            <span className="absolute -top-2 -right-2 z-10 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{chats.length}</span>
          </h3>
          <SearchModal startChat={startChat} />
        </header>
        {/* chat list*/}
      </div>
      <main className='custom-scrollbar flex flex-col items-start mt-2 pb-3'>
        {sortedChats?.map((chat) => {
          const currentUser = auth?.currentUser?.email;
          const otherUser = chat?.users?.find((user) => user?.email !== currentUser);
          return (
            <button
              key={chat.id}
              className="flex items-start w-[100%] justify-between border-b border-[#9090902c] px-3 py-1"
            >
              {chat?.users
                ?.filter((user) => user?.email !== auth?.currentUser?.email)
                .map((user) => (
                  <>
                    <div className="flex items-start gap-3 cursor-pointer" onClick={() => startChat(user)}>
                      <img
                        src={user?.image || defaultAvatar}
                        className="h-[60px] w-[60px] rounded-full object-cover"
                        alt={user.fullName}
                      />
                      <span>
                        <h2 className="p-0 font-bold text-[#2a3d39] text-left text-[17px]">
                          {user?.fullname}
                        </h2>
                        <p className="p-0 font-light text-[#2a3d39] text-left text-[14px]">
                          {chat?.lastMessage}
                        </p>
                      </span>
                    </div>
                    <p className="p-0 font-bold text-gray-400 text-left text-[11px]">
                      {formatTimestamp(chat?.lastSeen)}
                    </p>
                  </>
                ))}
            </button>
          )
        })}

      </main>
    </section >
  )
}

export default Chatlist
