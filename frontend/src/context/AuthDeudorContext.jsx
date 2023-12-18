import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const deudor = JSON.parse(localStorage.getItem("deudor")) || "";
  const isAuthenticated = deudor ? true : false;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth-deudor");
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, deudor }}>
      {children}
    </AuthContext.Provider>
  );
}
