import React, { useState, useEffect } from 'react'
import Navlinks from './components/Navlinks'
import Chatbox from './components/Chatbox'
import Chatlist from './components/Chatlist'
import Login from './components/Login'
import Register from './components/Register'
//firebase
import { auth } from './firebase/firebase'
const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); //cleanup function
  }, []);
  return (
    <div>
      {user ? (<div className="flex lg:flex-row flex-col items-start w-[100%]">
        <Navlinks></Navlinks>
        <Chatlist setSelectedUser={setSelectedUser}></Chatlist>
        <Chatbox selectedUser={selectedUser}></Chatbox>
      </div>) : (<div>
        {isLogin ? <Login isLogin = {isLogin} setIsLogin = {setIsLogin}></Login> : <Register isLogin = {isLogin} setIsLogin = {setIsLogin}   ></Register>}
      </div>)
      };
    </div>
  )
}

export default App
