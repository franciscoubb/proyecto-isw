import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import AppDeudor from "./routes/AppDeudor.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root.jsx";
import RootDeudor from "./routes/RootDeudor.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import Login from "./routes/Login.jsx";
import DeudoresPage from "./routes/DeudoresPage.jsx";
import CobrosPage from "./routes/CobrosPage.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import LoginDeudor from "./routes/LoginDeudor.jsx";
import DeudorCobroDetalles from "./components/DeudorCobroDetalles.jsx";
import Pagos from "./components/Pagos.jsx";
import "../style.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/deudores",
        element: <DeudoresPage />,
      },
      {
        path: "/cobros",
        element: <CobrosPage />,
      },
      {
        path: "/cobros/pagos/:id",
        element: <Pagos />,
      },
      {
        path: "/cobros/pagos/:id",
        element: <Pagos />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/auth-deudor",
    element: <LoginDeudor />,
  },
  {
    path: "/deudor",
    element: <RootDeudor />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/deudor",
        element: <AppDeudor />,
      },
      {
        path: "/deudor/:id",
        element: <DeudorCobroDetalles />,
      },
    ],
  },
  {
    path: "/auth-deudor",
    element: <LoginDeudor />,
  },
  {
    path: "/deudor",
    element: <RootDeudor />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/deudor",
        element: <AppDeudor />,
      },
      {
        path: "/deudor/:id",
        element: <DeudorCobroDetalles />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
