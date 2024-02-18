import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export default function Signup() {
  const [formData, setformData] = useState({});
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const handlechange= (e) => {
    setformData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const handleSubmit = async (e) =>{
      e.preventDefault();
      try{
        setloading(true);
        const res = await fetch("http://localhost:3000/api/auth/signin",{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
              })
          const data = await res.json();
          if(data.success === false){
            setloading(false);
            seterror(data.message);
            return
          }
          setloading(false);
          seterror(null);
          navigate('/')
         

      } catch(err){
        seterror(err);
        setloading(false);
      }
  }
    console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handlechange}
         
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handlechange}
         
        />

          <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
       
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/signup'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
   
    </div>
  )
}
