import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPagosByCobroId } from "../services/pago.service";
import { getCobroById } from "../services/cobro.service";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatRut } from "rutlib";
import currencyFormatter from "currency-formatter";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";

const Pagos = () => {
  dayjs.extend(utc);

  const { id } = useParams();
  const [pagos, setPagos] = useState([]);
  const [cobro, setCobro] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pagosResponse = await getPagosByCobroId(id);
        setPagos(pagosResponse.pagos);

        const cobroResponse = await getCobroById(id);
        setCobro(cobroResponse);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <>
      <Button as={Link} to="/cobros">
        volver
      </Button>
      <CardGroup className="gap-2">
        <Card
          bg="info"
          text="light"
          className="mb-2"
          style={{ width: "18rem", maxHeight: "300px" }}
        >
          <Card.Body>
            <Card.Title>Datos de Deudor</Card.Title>
            <Card.Text>
              Nombre: {cobro.deudorId.nombre} {cobro.deudorId.apellido}
            </Card.Text>
            <Card.Text>RUT: {formatRut(cobro.deudorId.rut)}</Card.Text>
            <Card.Text>Teléfono: +56{cobro.deudorId.telefono}</Card.Text>
            <Card.Text>Email: {cobro.deudorId.email}</Card.Text>
          </Card.Body>
        </Card>
        <Card
          bg="dark"
          text="light"
          className="mb-2"
          style={{ width: "18rem", maxHeight: "300px" }}
        >
          <Card.Body>
            <Card.Title>Datos de Deuda</Card.Title>
            <Card.Text>Tipo de trámite: {cobro.tipoTramite}</Card.Text>
            <Card.Text>
              {" "}
              Vencimiento:{" "}
              {dayjs.utc(cobro.plazoMaximoPago).format("DD/MM/YYYY")}
            </Card.Text>
            <Card.Text>
              Monto Deuda:{" "}
              {currencyFormatter.format(cobro.monto, {
                code: "CLP",
              })}
            </Card.Text>
          </Card.Body>
        </Card>
      </CardGroup>
      <h2>Pagos</h2>
      <ListGroup as="ol" numbered className="mb-3">
        {pagos.map((pago) => (
          <ListGroup.Item
            key={pago._id}
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                {currencyFormatter.format(pago.monto, {
                  code: "CLP",
                })}
              </div>
              Tipo: {pago.tipo}
            </div>
            <Badge bg="primary" pill>
              {dayjs.utc(pago.fecha).format("DD/MM/YYYY")}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default Pagos;
