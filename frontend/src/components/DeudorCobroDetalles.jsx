import { useParams, Link } from "react-router-dom";
import { getDeuda } from "../services/deudores.service";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Button from "react-bootstrap/Button";
import PagoDeudorForm from "./PagoDeudorForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const DeudorCobroDetalles = () => {
  const { id } = useParams();
  const [cobro, setCobro] = useState({});
  useEffect(() => {
    getDeuda(id).then((response) => {
      setCobro(response);
    });
  }, []);
  dayjs.extend(utc);

  return (
    <>
      <Button as={Link} to={"/deudor"}>
        Volver
      </Button>
      <div className="d-flex flex-column align-items-center shadow">
        <div className="shadow m-3 p-5">
          <h2 className="text-center">Paga tu Deuda</h2>
          {cobro.deudorId && (
            <Row className="p-2">
              <Col>Nombre de cliente: </Col>
              <Col className="fw-bold text-end">
                {cobro.deudorId.nombre} {cobro.deudorId.apellido}
              </Col>
            </Row>
          )}
          <Row className="p-2">
            <Col>Tipo de trámite: </Col>
            <Col className="fw-bold text-end">{cobro.tipoTramite}</Col>
          </Row>
          <Row className="p-2">
            <Col>Por pagar:</Col>
            <Col className="fw-bold text-end">
              {Number(cobro.monto - cobro.montoPagado).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </Col>
          </Row>
          <Row className="p-2">
            <Col>Pagar hasta: </Col>
            <Col className="fw-bold text-end">
              {dayjs.utc(cobro.plazoMaximoPago).format("DD/MM/YYYY")}
            </Col>
          </Row>
          <PagoDeudorForm cobro={cobro} setCobro={setCobro} />
        </div>
      </div>
    </>
  );
};

export default DeudorCobroDetalles;
