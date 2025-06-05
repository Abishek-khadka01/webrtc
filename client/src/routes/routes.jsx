import {Routes, Route} from "react-router-dom"
import MainPage from "../pages/MainPage"
import Call from "../pages/Call"

const AppRoutes = ()=>{

    return(
        <Routes>
            <Route path="/" element={ <MainPage/>}></Route>
            <Route path="/:id" element={ <Call/>}></Route>



        </Routes>



    )



}


export default AppRoutes