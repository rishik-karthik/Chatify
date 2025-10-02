import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import Message from './Message';

const Login = ({ isLogin, setIsLogin }) => {
  // form data state variable
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [displayMessage, setDisplayMessage] = useState({ bool: false, text: "" });
  const handleChangeUserData = (e) => {
    const { name, value } = e.target;

    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  };

  //invoke database[firebase]
  const handleAuth = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.password)
    } catch (error) {
      console.log(error);
      setDisplayMessage({ bool: true, text: error.message });
      setTimeout(() => {
        setDisplayMessage({ bool: false, text: "" });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className='flex flex-col justify-center items-center h-[100vh] bg-image'>
      {/* error message */}
      {displayMessage.bool && (<Message message={displayMessage.text} />)}
      {/* signin form */}
      <div className='bg-white shadow-lg p-5 rounded-x1 h-[27rem] w-[28rem] flex flex-col justify-center items-center'>
        <div className='mb-10'>
          <h1 className='text-center text-[28px] font-bold'>Sign In</h1>
          <p className='text-center text-sm text-gray-400'>Welcome back, Sign In to continue</p>
        </div>
        <div className='w-full'>
          <input type="email" name='email' onChange={handleChangeUserData} className="border border-black-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-mediunm outline-none placeholder:text-[#00493958]" placeholder='Email' />
          <input type="password" name='password' onChange={handleChangeUserData} className="border border-black-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-mediunm outline-none placeholder:text-[#00493958]" placeholder='Password' />
        </div>
        {/* Login button */}
        <div className='w-full'>
          <button disabled={loading} onClick={handleAuth} className='bg-[#01aa85] text-white font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center cursor-pointer'>
            {
              loading ? (
                <div className='loader'></div>
              ) : "Login"
            }
          </button>
        </div>
        <div>
          <button className='mt-5 text-center text-gray-400 text-sm cursor-pointer' onClick={() => setIsLogin(!isLogin)}>New Account? Sign Up</button>
        </div>
      </div>
    </section>
  )
}

export default Login
