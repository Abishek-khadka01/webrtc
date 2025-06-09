import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import useUserStore from "../context/user.context";

export default function RouteController() {
  const navigate = useNavigate();
  const { isLogin, name, email, profilePicture, logout } = useUserStore();

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  return (
    <>
      {isLogin && (
        <Navbar
        />
      )}
      <Outlet />
    </>
  );
}
