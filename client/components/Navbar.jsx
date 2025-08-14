import React from 'react'
import assets from '../src/assets/logo.jpeg'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl , setUserData, userData, setIsLoggedIn } = useContext(AppContext);

  const sendVerificationEmail = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/user/send-verify-otp`);
      if (data.success) {
        navigate('/verify-email');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div>
      <nav className='flex justify-between items-center bg-blue-200  p-4'>
        <img onClick={()=>navigate('/')} className='w-10 h-10' src={assets} alt="logo" />
        {userData ? <div className='flex items-center gap-4'>
          <span className='px-2 py-1 w-8 h-8 text-lg font-semibold rounded-full bg-black text-white  '>{userData.name[0].toUpperCase()}</span>
          {userData.isAccountVerified &&  <p onClick={sendVerificationEmail} className='cursor-pointer'>Verify Email</p>}
         
          <button onClick={() => {
            setUserData(null);
            setIsLoggedIn(false);
            navigate('/');
          }} className='p-2 px-4 bg-blue-700 text-white rounded hover:bg-red-500 '>Logout</button>
        </div> :
          <button onClick={()=>navigate('/login')} className='p-2 px-4 border-2 rounded-full hover:bg-blue-100'>Login</button>
        }
      </nav>
    </div>
  )
}

export default Navbar