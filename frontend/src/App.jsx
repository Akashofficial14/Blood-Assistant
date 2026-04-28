import React from 'react'
  import { ToastContainer, toast } from 'react-toastify';
import UserDashboard from './pages/user/UserDashboard';

const App = () => {
  return (
    <div className='min-h-screen max-w-screen bg-[#FFFDFD]'>
   <UserDashboard/>
   <ToastContainer/>
    </div>
  )
}

export default App
