import React, { useState } from 'react'
import logo from '/assets/chatLogo.jpg'
import { RiChatAiLine, RiChatAiFill, RiFolderUserLine, RiNotificationLine, RiFile4Line, RiBardLine, RiArrowDownSFill, RiShutDownLine } from "react-icons/ri";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
const Navlinks = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    // to hold 1/3 sections-menu
    <section className='sticky lg:static top-0 flex items-center lg:items-start lg:justify-start h-[7vh] lg:h-[100vh] w-[100%] lg:w-[150px] py-8 lg:py-0 bg-[#01aa85]'>
      <main className='flex lg:flex-col items-center lg:gap-10 justify-between lg:px-0 w-[100%]'>
        <div className='flex items-start justify-center lg:border-b  lg:w-[100%] p-4 border-[#ffffffb9]'>
          <span className='flex items-center justify-center'>
            <img src={logo} className='w-[56px] h-[52px] object-contain bg-white rounded-lg p-2' alt="logo" />
          </span>
        </div>
        {/* menu-icons */}
        <ul className='flex lg:flex-col flex-row items-center gap-7 px-2 md:px-0'>
          <li className=''>
            <button className='lg:text-[28px] text-[22px] cursor-pointer'><RiChatAiLine color="#fff" /></button>
          </li>
          <li className=''>
            <button className='lg:text-[28px] text-[22px] cursor-pointer'><RiFolderUserLine color="#fff" /></button>
          </li>
          <li className=''>
            <button className='lg:text-[28px] text-[22px] cursor-pointer'><RiNotificationLine color="#fff" /></button>
          </li>
          <li className=''>
            <button className='lg:text-[28px] text-[22px] cursor-pointer'><RiFile4Line color="#fff" /></button>
          </li>
          <li className=''>
            <button className='lg:text-[28px] text-[22px] cursor-pointer'><RiBardLine color="#fff" /></button>
          </li>
          <li className=''>
            <button onClick={handleLogout} className='lg:text-[28px] text-[22px] cursor-pointer'><RiShutDownLine color="#fff" /></button>
          </li>
        </ul>
        <button className='lg:hidden block lg:text-[28px] text-[22px] cursor-pointer'>
          <RiArrowDownSFill color="#fff" />
        </button>
      </main>
    </section>
  )
}

export default Navlinks
