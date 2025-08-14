import React, { useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {
  const navigate = useNavigate()

  const {backendUrl,setIsLoggedIn,getUserData} = useContext(AppContext)

  const [visible, setVisible] = useState('Sign up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    try{
      e.preventDefault();

      axios.defaults.withCredentials = true

      if(visible === 'Sign up'){
        const {data} = await axios.post(backendUrl+'/api/auth/register', {
          name,email,password})

          if(data.success){
            setIsLoggedIn(true)
            getUserData()
            navigate('/')
          }else {
            toast.error(data.message)
          }
      }

      else {
        const {data} = await axios.post(backendUrl+'/api/auth/login', {
          email,password})

          if(data.success){
            setIsLoggedIn(true)
            getUserData()
            navigate('/')
          }else {
            toast.error(data.message)
          }
        }
    }catch(error) {
      toast.error(error.message)
    }

  };

  return (
    <section className='min-h-screen bg-gray-100'>
      <Navbar />
      <div className='container mx-auto p-4 mt-4'>
        {visible === 'Sign up' && (<h1 className='text-3xl font-bold text-center mt-10'>Register</h1>)}
        {visible === 'Login' && (<h1 className='text-3xl font-bold text-center mt-10'>Login Page</h1>)}
       {visible==='Sign up'? <p className='text-center mt-4'>Please enter your credentials to Register.</p>:
        <p className='text-center mt-4'>Please enter your credentials to login.</p>}
        <form onSubmit={handleSubmit} className='max-w-md mx-auto mt-8'>
          {visible === 'Sign up' && (<div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='name'>Name</label>
            <input type='name' id='name' value={name} onChange={e=>setName(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your name' required />
          </div>)}
          
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input type='email' id='email' value={email} onChange={e=>setEmail(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your email' required />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
            <input type='password' id='password' value={password} onChange={e=>setPassword(e.target.value)}   className='w-full p-2 border rounded' placeholder='Enter your password' required />
          </div>
          <p onClick={()=>navigate("/reset-password")} className='pb-2 cursor-pointer'>Forget Password?</p>
          <button className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>{visible}</button>
          </form>
        {visible === 'Sign up' && (
          <p className='text-center mt-4'>Already have an account? <button onClick={() => setVisible('Login')} className='text-blue-500 hover:underline'>Login here</button></p>
        )} {visible==='Login'&& ( 
        <p className='text-center mt-4'>Don't have an account? <button onClick={() => setVisible('Sign up')}  className='text-blue-500 hover:underline'>Register here</button></p>
        )}
        
        </div>
    </section>
  )
}

export default Login