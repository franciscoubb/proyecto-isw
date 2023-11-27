import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import Login from "./routes/Login.jsx";
import DeudoresPage from "./routes/DeudoresPage.jsx";
import CobrosPage from "./routes/CobrosPage.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
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
    ],
  },
  {
    path: "/auth",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
