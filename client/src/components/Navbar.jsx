import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';


const Navbar = () => {
    const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContent)
    const navigate =useNavigate();
  
    const logout = async()=>{
      try{
        axios.defaults.withCredentials=true
        const {data} = await axios.post(backendUrl + 'api/auth/logout')
        data.success && setIsLoggedin(false)
        data.success && setUserData(false)
        navigate('/')
      } catch(error){
           console.log(error);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);
      }
    }
   
    const sendVerificationOtp= async()=>{
       try{
        axios.defaults.withCredentials=true;

      const {data} = await axios.post(backendUrl +'api/auth/send-verify-otp')

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }
        else{
          toast.error(data.message)
        }
       }
       catch(error){
        console.log(error);
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        toast.error(errorMessage);
       }
    }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
       <img src={assets.logo} alt="" className="w-28 sm:w-32"/>

      {userData ? 
      
      <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
        {userData.name[0].toUpperCase()}
        <div className="absolute hidden w-[140px] group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
          <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
            {!userData.isAccountVerified && <li className="py-1 px-2 hover:bg-gray-200" onClick={sendVerificationOtp}>Verify Email</li> }
            
            <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={logout}>Logout</li>
          </ul>
        </div>
      </div>

      :
        <button onClick={()=>navigate('/login')}
          className="flex gap-2 items-center border border-gary-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">
          Login            
          <img src={assets.arrow_icon} alt=""/>
        </button>
      }

       
    </div>
  )
}

export default Navbar