import React from "react";
import { useNavigate } from "react-router-dom";

import LoginDeudorForm from "../components/LoginDeudorForm";
const LoginDeudor = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("deudor")) {
    return (
      <>
        <h2>Ya estas logeado!</h2>
        <button onClick={() => navigate("/deudor")}>Ir a home</button>
      </>
    );
  }
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <LoginDeudorForm />
    </div>
  );
};

export default LoginDeudor;
