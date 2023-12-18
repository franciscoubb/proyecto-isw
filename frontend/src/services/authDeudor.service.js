import axios from "./rootDeudor.service";
import cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export const login = async ({ rut }) => {
  try {
    const response = await axios.post("auth/deudor/login", {
      rut,
    });
    const { status, data } = response;
    if (status === 200) {
      const { rut } = await jwtDecode(data.data.accessToken);
      localStorage.setItem("deudor", JSON.stringify({ rut }));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.accessToken}`;
      cookies.set("jwt-authDeudor", data.data.accessToken, { path: "/deudor" });
    }
    if (data.error) {
      if (data.error.message === "El deudor no existe") {
        return console.log("Bien");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  localStorage.removeItem("deudor");
  delete axios.defaults.headers.common["Authorization"];
  cookies.remove("jwtDeudor");
  cookies.remove("jwt-authDeudor");
};
