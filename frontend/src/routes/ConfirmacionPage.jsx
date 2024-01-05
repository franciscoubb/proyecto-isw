import { useState, useEffect } from "react";
import { getPagosNoConfirmados, confirmaPago } from "../services/pago.service";
import SimpleTable from "../components/SimpleTable";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
const ConfirmacionPage = () => {
  dayjs.extend(utc);
  const [pagosNoConfirmados, setPagosNoConfirmados] = useState([]);
  useEffect(() => {
    traerPagos();
  }, []);
  const actualizarPago = async (id) => {
    try {
      await confirmaPago(id);
      setPagosNoConfirmados((prevPagos) =>
        prevPagos.filter((pago) => pago._id !== id)
      );
    } catch (error) {
      console.error("Error al confirmar pago", error);
    }
    Swal.fire({
      position: "center",
      icon: "success",
      title: `pago aceptado, detalles enviados por correo a deudor.`,
      showConfirmButton: true,
      allowOutsideClick: false,
    });
  };
  const columns = [
    {
      header: "Monto",
      accessorKey: "monto",
      cell: (info) => {
        const cellValue = info.getValue();
        return Number(cellValue).toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        });
      },
    },
    {
      header: "Fecha",
      accessorKey: "fecha",
      cell: (info) => {
        return dayjs.utc(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "Tipo",
      accessorKey: "tipo",
    },
    {
      header: "Estado",
      accessorKey: "estado",
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const pago = row.original;
        return (
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => actualizarPago(pago._id)}
          >
            Confirmar Pago
          </Button>
        );
      },
    },
  ];
  const traerPagos = async () => {
    try {
      const pagos = await getPagosNoConfirmados();
      setPagosNoConfirmados(pagos);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      <h2>Confirmación Pagos</h2>
      <SimpleTable
        data={pagosNoConfirmados}
        columns={columns}
        className="mt-5"
      />
    </>
  );
};

export default ConfirmacionPage;
