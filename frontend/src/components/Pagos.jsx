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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <>
      <Button as={Link} to="/cobros">
        volver
      </Button>
      <h2>Datos de deudor</h2>
      <p>
        Nombre: {cobro.deudorId.nombre} {cobro.deudorId.apellido}
      </p>
      <p>RUT: {formatRut(cobro.deudorId.rut)}</p>
      <p>Teléfono: +56{cobro.deudorId.telefono}</p>
      <p>Email: {cobro.deudorId.email}</p>
      <h2>Deuda</h2>
      <p>Tipo de trámite: {cobro.tipoTramite}</p>
      <p>
        Vencimiento: {dayjs.utc(cobro.plazoMaximoPago).format("DD/MM/YYYY")}
      </p>
      <p>
        Monto Deuda:{" "}
        {currencyFormatter.format(cobro.monto, {
          code: "CLP",
        })}
      </p>
      <h2>Pagos</h2>
      {pagos.map((pago) => (
        <p key={pago._id}>
          Fecha: {dayjs.utc(pago.fecha).format("DD/MM/YYYY")} Monto:
          {currencyFormatter.format(pago.monto, {
            code: "CLP",
          })}{" "}
          Tipo: {pago.tipo}
        </p>
      ))}
    </>
  );
};

export default Pagos;
