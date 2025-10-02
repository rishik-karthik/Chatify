import React, { useState } from 'react'
import defaultAvatar from '/assets/user_profile_default.jpg'
import { FaSearch } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { RiSearchFill, RiSearchLine } from 'react-icons/ri'
import Message from './Message'
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const SearchModal = ({ startChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [displayMessage, setDisplayMessage] = useState({ bool: false, text: "" });
  const openModal = () => {
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setDisplayMessage({ bool: true, text: "Enter a valid User -_-" })
      setTimeout(() => {
        setDisplayMessage({ bool: false, text: "" });
      }, 3000);
      return;
    }
    try {
      const normalizedTerm = searchTerm.toLowerCase();
      const q = query(
        collection(db, "user"),
        where("username", ">=", normalizedTerm),
        where("username", '<=', normalizedTerm + "\uf8ff")
      )
      const querySnapshot = await getDocs(q);
      const foundUsers = [];

      querySnapshot.forEach(doc => {
        foundUsers.push(doc.data());
      });

      setUsers(foundUsers);
      console.log(foundUsers)

      if (foundUsers.length === 0) {
        setDisplayMessage({ bool: true, text: "No User Found :(" })
        setTimeout(() => {
          setDisplayMessage({ bool: false, text: "" });
        }, 3000);
      }
    } catch (error) {
      setDisplayMessage({ bool: true, text: error.message })
      setTimeout(() => {
        setDisplayMessage({ bool: false, text: "" });
      }, 3000);
      console.log(error);
    }
  }
  const handleEnter = async () => {
    if (!searchTerm.trim()) {
      setDisplayMessage({ bool: true, text: "Enter a valid User -_-" })
      setTimeout(() => {
        setDisplayMessage({ bool: false, text: "" });
      }, 3000);
      return;
    };
    try {
      const normalizedTerm = searchTerm.toLowerCase();
      const q = query(
        collection(db, 'user'),
        where("username", ">=", normalizedTerm),
        where("username", "<=", normalizedTerm + "\uf8ff")
      )
      const querySnapshot = await getDocs(q);
      const foundUsers = [];
      querySnapshot.forEach(doc => {
        foundUsers.push(doc.data());
      });

      setUsers(foundUsers);
      console.log(foundUsers)

      if (foundUsers.length === 0) {
        setDisplayMessage({ bool: true, text: "No User Found :(" })
        setTimeout(() => {
          setDisplayMessage({ bool: false, text: "" });
        }, 3000);
      }

    } catch (error) {
      setDisplayMessage({ bool: true, text: error.message })
      setTimeout(() => {
        setDisplayMessage({ bool: false, text: "" });
      }, 3000);
      console.log(error);
    }
  }
  return (
    <div>
      {/* navbar-btn */}
      <button onClick={openModal}>
        <RiSearchLine className='text-[#01aa85] bg-[#d9f2ed] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg' />
      </button>
      {isModalOpen &&
        // dialog box
        (<div className='fixed inset-0 z-[100] flex justify-center items-center bg-[#35433cb7]'>
          <div className='relative p-4 w-full max-w-md max-h-full'>
            <div className='relative bg-[#01aa85] w-[100%] rounded-md shadow-lg'>
              <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-300'>
                <h3 className='text-[20px] font-semibold text-white'>Search Chat</h3>
                <button onClick={closeModal} className='text-white bg-transpareent hover:bg-[#d9f2ed] hover:text-[#01aa85] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center'>
                  <FaXmark />
                </button>
              </div>
              {displayMessage.bool && (<Message message={displayMessage.text} />)}
              {/* search bar */}
              <div className='p-4 md-:p-5'>
                <div className='space-y-4'>
                  <div className='flex gap-2'>
                    <input onKeyDown={(e) => {
                      if (e.key === 'Enter') { handleEnter() }
                    }} onChange={(e) => setSearchTerm(e.target.value)} type="text" className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full p-2.5' />
                    <button onClick={handleSearch} className='bg-green-900 text-white px-3 py-2 rounded-lg'>
                      <FaSearch />
                    </button>
                  </div>
                </div>
                {/* users */}
                <div className='mt-6'>
                  {users?.map((user) => (
                    <div onClick={() => {
                      console.log(user);
                      startChat(user);
                      closeModal();
                    }}
                      className='flex items-start gap-3 mb-3 bg-[#15eabc34] p-2 rounded-lg cursor-pointer border-[#ffffff20] shadow-lg'>
                      <img src={user?.image || defaultAvatar} className='h-10 w-10 rounded-full' alt="user img" />
                      <span>
                        <h2 className='p-0 font-semibold text-white text-[18px]'>{user.fullname}</h2>
                        <p className='text-[13px] text-gray-200 font-light'>@{user.username}</p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>)
      }

    </div>
  )
}

export default SearchModal
