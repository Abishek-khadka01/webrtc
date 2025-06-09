import {Routes, Route} from "react-router-dom"
import MainPage from "../pages/MainPage"
import Call from "../pages/Call"
import GoogleCallback from "../pages/GoogleCallback"
import LoginPage from "../pages/Login"
import RouteController from "./RouteController"
import LandingPage from "../pages/LandingPage"

const AppRoutes = ()=>{

    return(
        <Routes>

            <Route path="/" element={<RouteController/>}>
            <Route path="/dashboard" element={ <MainPage/>}></Route>
            <Route path="/:id" element={ <Call/>}></Route>
            <Route path="/google" element={<GoogleCallback/>}></Route>
            <Route path="/" element={<LandingPage/>}></Route>
            </Route>
            <Route path="/login" element={<LoginPage/>}></Route>
        </Routes>



    )



}


export default AppRoutes