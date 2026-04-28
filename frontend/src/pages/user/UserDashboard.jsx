import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../../components/Navbar'

const UserDashboard = () => {
  return (
    <div className='h-full w-full ' >
        <Navbar/>
        {/* <Home/> */}
        <Outlet/>
    </div>
  )
}

export default UserDashboard
