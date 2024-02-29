import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const {currentUser} = useSelector((store) => store.user);
  return  <div>
        {currentUser ? (
            <Outlet />
        ) : (
            <div>
            <p>Please sign in</p>
            <Navigate to='/signin' />
            </div>
        )}
        </div>
        
}


export default PrivateRoute