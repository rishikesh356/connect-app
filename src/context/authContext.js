import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider=({children})=>{
    const [currentUser, setcurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const login=()=>{
        setcurrentUser({
            id:1,
            name:"Rishi",
            profilePic:"https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600"
        });
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