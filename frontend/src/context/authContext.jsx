import {React,createContext} from "react"

const AuthContext = createContext({
    credential:"",
    password:"",
    toggleTheme:()=>{},
    login:()=>{},
    logout:()=>{}
});
