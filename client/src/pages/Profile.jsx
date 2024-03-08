import React, { useEffect, useRef, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {app} from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userslice"
import { Link } from 'react-router-dom';



const Profile = () => {
    const fileRef = useRef(null);
    const dispatch = useDispatch();
    const {currentUser,loading } = useSelector((store)=>store.user)
    const [filePerc,setFilePerc] = useState(0);
    const [file, setFile] = useState(undefined);
    const [FileUploadError, setFileUploadError] = useState(false)
    const [FormData, setFormData] = useState({});
    const [userListings,setuserListings] = useState([]);
    const [ShowListingError,setShowListingError]= useState(false)

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
      // console.log(FormData);
    }

    const handleDeleteUser = async ()=>{
      try{
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });

        const data=await res.json()
        if(data.success=== false){
          dispatch(deleteUserFailure(data.message));
          return 
        }

        dispatch(deleteUserSuccess(data));


      } catch(err){
        dispatch(deleteUserFailure(err.message));
      }
      

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
        
          // console.log(data);
          if(data.success === false){
            dispatch(updateUserFailure(data.message))
            return ;
          }
          dispatch(updateUserSuccess(data));
        } catch(err){
          dispatch(updateUserFailure(err));
        }
        


    }
    const handleSignOut = async () => {
      try {
        dispatch(signOutUserStart());
        const res = await fetch('/api/auth/signout');
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(data.message));
      }
    };

    const handleShowListings = async  ()=>{
      try{
        setShowListingError(false);
        const res =  await fetch(`api/user/listings/${currentUser._id}`);
        const data = res.json();
         if(data.success === false){
          setShowListingError(true);
          return 
         }else{
          setuserListings(data);
         }


      } catch(err){
        setShowListingError(true);
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
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listings
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span  onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      {/* <p className='text-red-700 mt-5'>{error ? error : ''}</p> */}
      {/* <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p> */}
      <button onClick={handleShowListings} className='text-greeen-700 w-full'>
          Show listings
      </button>

      {
        userListings && userListings.length >0  && <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {
            userListings.map((listing) => (
              <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button className='text-red-700 uppercase'>Delete</button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>
            </div>
            ))}

          </div>
        }
      

     
     
    </div>
  )
}

export default Profile