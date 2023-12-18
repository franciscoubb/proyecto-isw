import { Outlet } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../services/authDeudor.service";
import { AuthProvider, useAuth } from "../context/AuthDeudorContext";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth-deudor");
  };

  const { deudor } = useAuth();

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/deudor">
            gestiona tus pagos y cobros
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <DropdownButton
              id="dropdown-basic-button"
              size="sm"
              title={deudor.rut || ""}
            >
              <Dropdown.Item size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Dropdown.Item>
            </DropdownButton>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Outlet />
      </Container>
    </>
  );
}

export default Root;
