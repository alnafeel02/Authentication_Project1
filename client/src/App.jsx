import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import VerifyEmail from '../pages/VerifyEmail.jsx'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



function App() {
    return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>


    </>
  )
}

export default App
