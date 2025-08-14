import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

const Home = () => {

  const { userData } = useContext(AppContext)


  return (
    <section className='min-h-screen bg-gray-100 '>  
    <Navbar />
    <div className='container mx-auto p-4 mt-16'>
      <h1 className='text-3xl font-bold text-center mt-10'>Hey {userData ? userData.name.toUpperCase() : 'Developer'}!</h1>
      <h1 className='text-3xl font-bold text-center mt-10'>Welcome to the Home Page</h1>
      <p className='text-center mt-4'>This is the home page of our
      authentication project. You can navigate to other pages using the links in the navbar.</p>
      <p className='text-center mt-2'>Feel free to explore!</p>
      <div className='flex justify-center mt-6'>
        <button className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>Get Started</button>
      </div>
    </div>
    </section>
    
  )
}

export default Home