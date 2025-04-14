import axios from "axios";
import { createContext, useState } from "react";
import { toast } from 'react-toastify';


export const  AppContent = createContext();

export const AppContextProvider =(props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)
   
    const getUserData = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + 'api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }
        catch(error){
            console.log(error);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);
        }
    }

    const getAuthState = async () =>{
        try{
         const {data}=  await axios.get(backendUrl +'/api/auth/is-auth')
        
        if(data.success){
            setIsLoggedin(true)
            getUserData()
        }
        
        }
        catch(error){
            console.log(error);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);
        }
    }
  

    const value = {
        backendUrl,
        isLoggedin , setIsLoggedin,
        userData ,  setUserData,
        getUserData

    }



    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}