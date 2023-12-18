import { useState, useEffect } from "react";
import { getMisDeudas } from "../services/deudores.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
const AppDeudor = () => {
  const [misDeudas, setMisDeudas] = useState([]);
  useEffect(() => {
    traerMisCobros();
  }, []);
  const traerMisCobros = async () => {
    try {
      const cobros = await getMisDeudas();
      setMisDeudas(cobros.filter((cobro) => cobro.estado === "pendiente"));
    } catch (error) {
      console.error(error.message);
    }
  };
  dayjs.extend(utc);
  if (misDeudas.length === 0) return <h1>Usted no posee deudas pendientes</h1>;
  return (
    <>
      <h1 className="mb-5 text-center">Mis Deudas Pendientes</h1>
      <div className="row justify-content-center">
        {misDeudas.map((deuda) => (
          <div key={deuda._id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="mx-auto">
              <Card
                // bg="secondary"
                text="dark"
                border="info"
                className="text-center"
                key={deuda._id}
              >
                <Card.Header>
                  <Card.Title>{deuda.tipoTramite}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ListGroup.Item className="text-start">
                    <span>pagar hasta: </span>{" "}
                    <span className="fw-bold">
                      {dayjs.utc(deuda.plazoMaximoPago).format("DD/MM/YYYY")}{" "}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item className="text-start">
                    <span>Monto: </span>
                    <span className="fw-bold">
                      {Number(deuda.monto).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item className="text-start">
                    <span>Monto Pagado: </span>
                    <span className="fw-bold">
                      {" "}
                      {Number(deuda.montoPagado).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item className="text-start">
                    <span>Por Pagar: </span>
                    <span className="fw-bold">
                      {" "}
                      {Number(deuda.monto - deuda.montoPagado).toLocaleString(
                        "es-CL",
                        {
                          style: "currency",
                          currency: "CLP",
                        }
                      )}
                    </span>
                  </ListGroup.Item>
                </Card.Body>
                <Card.Body>
                  <Button as={Link} to={`/deudor/${deuda._id}`}>
                    Ir a pagar
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AppDeudor;
