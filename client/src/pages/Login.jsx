import React, { useEffect } from "react";
import "../css/LoginPage.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import useUserStore from "../context/user.context";
const LoginPage = () => {
  const navigate  = useNavigate()
  useEffect(() => {
    document.title = "Login - Your App Name";
  `  // if(useUserStore.getState().isLogin){
    //     navigate("/dashboard")
    // }`
  }, []);

    console.log(useUserStore.getState().sub)

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome</h1>
        <p>Sign in with your Google account</p>
        <button className="google-btn" onClick={async ()=>{
            const response =  await axios.get("http://localhost:4000")
            if(response.status ==200){
                window.location.href =response.data.message
            }
        }}>
          <img
            src="https://icon2.cleanpng.com/lnd/20241121/sc/bd7ce03eb1225083f951fc01171835.webp"
            alt="Google logo"
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
