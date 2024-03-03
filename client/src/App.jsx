import React from 'react'
import { BrowserRouter ,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import CreateListing from './pages/CreateListing'






export default function App() {
  return (
    <BrowserRouter>
      <Header/>
        <Routes> 
            <Route path='/' element = {<Home/>}/>
            <Route path='/signup' element = {<Signup/>}/>
            <Route path='/signin' element = {<Signin/>}/>
            <Route element={<PrivateRoute />}>
                <Route path='/profile' element={<Profile />} />
                <Route path='/create-listing' element={<CreateListing />} />
            </Route>
          
            
          
        </Routes>
    </BrowserRouter>
  )
}
