import axios from "./root.service";
import cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post("auth/login", {
      email,
      password,
    });
    const { status, data } = response;
    if (status === 200) {
      const { email, roles } = await jwtDecode(data.data.accessToken);
      localStorage.setItem("user", JSON.stringify({ email, roles }));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.accessToken}`;
      cookies.set("jwt-auth", data.data.accessToken, { path: "/" });
    }
    if (data.error.message) {
      if (data.error.message === "El usuario y/o contraseña son incorrectos") {
        return console.log("Bien");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
  cookies.remove("jwt");
  cookies.remove("jwt-auth");
};
