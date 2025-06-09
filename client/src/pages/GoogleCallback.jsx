import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import useUserStore from "../context/user.context";
const GoogleCallback = ()=>{
   const setUser = useUserStore((state)=>state.setUser)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    console.log(searchParams.get("picture"))        

    useEffect(()=>{
        setUser({
            email : searchParams.get("email"),
            profile :searchParams.get("picture"),
            name : searchParams.get("name"),
            sub : searchParams.get("sub")
        })

        navigate("/dashboard")
    },[])



}

export default GoogleCallback