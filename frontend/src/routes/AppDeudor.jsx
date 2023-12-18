import { useState, useEffect } from "react";
import { getMisDeudas } from "../services/deudores.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
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
  console.log(misDeudas);
  dayjs.extend(utc);

  return (
    <>
      <h1>mis deudas pendientes</h1>
      <ListGroup>
        {misDeudas.map((deuda) => (
          <ListGroup.Item
            className="d-flex justify-content-between row"
            as="li"
            key={deuda._id}
          >
            <div className="col-12 col-md-2">
              <span className="fw-bold">{deuda.tipoTramite}</span>
            </div>
            <div className=" col-12 col-md-2">
              <span>pagar hasta: </span>
              <span className="fw-bold">
                {dayjs.utc(deuda.plazoMaximoPago).format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="col-12 col-md-2">
              <span>Monto: </span>
              <span className="fw-bold">
                {Number(deuda.monto).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </span>
            </div>
            <div className="col-2">
              <span>Monto Pagado: </span>
              <span className="fw-bold">
                {" "}
                {Number(deuda.montoPagado).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </span>
            </div>
            <Button
              className="col-1"
              size="sm"
              as={Link}
              to={`/deudor/${deuda._id}`}
            >
              Pagar
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default AppDeudor;
