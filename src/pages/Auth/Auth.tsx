import React from "react";
import { Outlet } from "react-router-dom";


const Auth: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Outlet />
    </div>
  );
};

export default Auth;
