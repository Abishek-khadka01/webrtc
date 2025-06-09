import React, { useState } from "react";
import useUserStore from "../context/user.context";
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Navbar = () => {

    console.log(useUserStore.getState().profile)
  const navigate = useNavigate()
  const handleLogin = () => {
   
      navigate("/login")
  };

  const handleLogout = async () => {
         const response = await axios.post("http://localhost:4000", {
          sub : useUserStore.getState().sub

        }, {
          withCredentials : true
        })

        if(response.status ==200 || response.data.success){
          alert(response.data.message)
          useUserStore.getState().logout()
        }
  };

  const isLoggedIn = useUserStore.getState().isLogin;
    console.log(isLoggedIn)
  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Video Call</div>

      {isLoggedIn ? (
        <div style={styles.userInfo}>
          <img
            src={useUserStore.getState().profile}
            alt="Profile"
            style={styles.profilePic}
          />
          <div style={styles.userDetails}>
            <div style={styles.userName}>{useUserStore.getState().name}</div>
            <div style={styles.userEmail}>{useUserStore.getState().email}</div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button style={styles.loginBtn} onClick={handleLogin}>
          Login Now
        </button>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    height: "60px",
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    flexWrap: "wrap",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "12px",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    marginRight: "16px",
    textAlign: "right",
    minWidth: "150px",
  },
  userName: {
    fontWeight: "600",
    fontSize: "1rem",
  },
  userEmail: {
    fontSize: "0.85rem",
    color: "#bdc3c7",
    wordBreak: "break-word",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  loginBtn: {
    backgroundColor: "#3498db",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Navbar;
