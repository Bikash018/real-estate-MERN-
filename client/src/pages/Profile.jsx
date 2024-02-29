import React, { useEffect, useRef, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {app} from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess
} from "../redux/user/userslice"



const Profile = () => {
    const fileRef = useRef(null);
    const dispatch = useDispatch();
    const {currentUser,loading } = useSelector((store)=>store.user)
    const [filePerc,setFilePerc] = useState(0);
    const [file, setFile] = useState(undefined);
    const [FileUploadError, setFileUploadError] = useState(false)
    const [FormData, setFormData] = useState({});

    useEffect(() => {
      if (file) {
        handleFileUpload(file);
      }
    }, [file]);

    const handleChange = (e)=>{
      setFormData({
        ...FormData,
        [e.target.id] : e.target.value
      })
      console.log(FormData);
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
       
        try{
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
            method : 'POST',
            headers : {
              'Content-Type' : "application/json"
            },
            body : JSON.stringify(FormData)

          })
          const data = await res.json();
        
          console.log(data);
          if(data.success === false){
            dispatch(updateUserFailure(data.message))
            return ;
          }
          dispatch(updateUserSuccess(data));
        } catch(err){
          dispatch(updateUserFailure(err));
        }
        


    }
    
    const handleFileUpload = (file) =>{
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef =ref(storage,filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          setFilePerc(Math.round(progress));
      
        }, 
        (error) => {
          // Handle unsuccessful uploads
          setFileUploadError(true);
        }, 
        () => {
      
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
            setFormData({...FormData, avatar: downloadURL})
          });
        }
      );

  }
  
  return (
 <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={FormData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
      
      <input
        type='text'
        placeholder='username'
        onChange={handleChange}
        id='username'
        defaultValue={currentUser.username}
        className='border p-3 rounded-lg'
      
      />
      <input
        type='email'
        placeholder='email'
        id='email'
        onChange={handleChange}
        className='border p-3 rounded-lg'
      
      />
      <input
        type='password'
        placeholder='password'
        onChange={handleChange}
        id='password'
        className='border p-3 rounded-lg'
      />
        <button
          disabled={loading}

          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
        {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
     
    </div>
  )
}

export default Profile