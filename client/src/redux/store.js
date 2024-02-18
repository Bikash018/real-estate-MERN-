import { configureStore } from '@reduxjs/toolkit'
import userReducer from "../redux/user/userslice.js"

export const store = configureStore({
  reducer: {
    user:userReducer 
  },
})