import { Outlet } from "react-router-dom";
import Nav from "./Components/Nav/Nav";

const Layout = ()=>{
    return(
        <>
            <Nav/>
            <Outlet/>
        </>
    )
}

export default Layout;