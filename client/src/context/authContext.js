import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider=({children})=>{
    const [currentUser, setcurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const login=async (inputs)=>{
        const res= await axios.post("http://localhost:8800/api/auth/login",inputs,{
            withCredentials:true//doing this as we are dealing with cookies
    })
    setcurrentUser(res.data)//our backend server  sends us user data other than  password
    //and cookies
    }
    useEffect(()=>{
     localStorage.setItem("user",JSON.stringify(currentUser))
    },[currentUser])

    return(
        <AuthContext.Provider value={{currentUser,login}}>
            {children}
        </AuthContext.Provider>
    )
}