import { useState, useEffect } from "react";
import {
  getCobros,
  eliminarCobro,
  obtenerExcel,
} from "../services/cobro.service";
import SimpleTable from "../components/SimpleTable";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
// import EditCobroForm from "../components/EditCobroForm";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
const CobrosPage = () => {
  dayjs.extend(utc);
  const [cobros, setCobros] = useState([]);
  useEffect(() => {
    traerCobros();
  }, []);
  const traerCobros = async () => {
    try {
      const cobros = await getCobros();
      setCobros(cobros);
    } catch (error) {
      console.error(error.message);
    }
  };
  const borrarCobro = async (cobro) => {
    const result = await Swal.fire({
      title: "Estas seguro?",
      html: `No podrás revertir esto! </br>
      <b>Estado:</b> ${cobro.estado} </br>
      <b>Por pagar:</b> ${Number(
        cobro.monto - cobro.montoPagado
      ).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
      })}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, bórralo!",
    });

    if (result.isConfirmed) {
      try {
        const { _id } = cobro;
        await eliminarCobro(_id);

        const filtradoCobro = cobros.filter((cobro) => cobro._id !== _id);
        setCobros(filtradoCobro);

        Swal.fire({
          title: "Eliminado!",
          text: "La deuda se eliminó correctamente.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error al eliminar deuda:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al eliminar la deuda.",
          icon: "error",
        });
      }
    }
  };

  const excel = async () => {
    try {
      await obtenerExcel();
    } catch (error) {
      console.error(error.message);
    }
  };

  const columns = [
    {
      header: "RUT Deudor",
      accessorKey: "deudorId.rut",
    },
    {
      header: "Tipo de trámite",
      accessorKey: "tipoTramite",
    },
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
      header: "Monto pagado",
      accessorKey: "montoPagado",
      cell: (info) => {
        const cellValue = info.getValue();
        return Number(cellValue).toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        });
      },
    },
    {
      header: "Estado",
      accessorKey: "estado",
      cell: (info) => {
        const cellValue = info.getValue();
        let colorClass = "";
        if (cellValue === "pendiente") {
          colorClass = "primary";
        } else if (cellValue === "vencida") {
          colorClass = "danger";
        } else if (cellValue === "pagada") {
          colorClass = "success";
        }

        return (
          <div className="d-flex">
            <Badge
              pill
              bg={colorClass}
              text="light"
              className="col-12 col-lg-12 col-xl-10 col-xxl-8 p-2"
            >
              {cellValue}
            </Badge>
          </div>
        );
      },
    },

    {
      header: "Fecha emisión",
      accessorKey: "fechaEmision",
      cell: (info) => {
        return dayjs(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "Vencimiento",
      accessorKey: "plazoMaximoPago",
      cell: (info) => {
        return dayjs.utc(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const cobro = row.original;
        return (
          <div className="d-flex flex-column flex-sm-row align-items-start">
            <Button
              variant="outline-danger"
              size="sm"
              className="mb-2 mb-sm-0 me-sm-2 w-100"
              onClick={() => borrarCobro(cobro)}
            >
              Eliminar
            </Button>
            {cobro.montoPagado > 0 && (
              <Button
                variant="outline-info"
                size="sm"
                className="w-100"
                as={Link}
                to={`/cobros/pagos/${cobro._id}`}
              >
                VerPagos
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <h2>Lista de Deudas y sus pagos</h2>
      <div className="mb-2">
        <Button
          variant="success"
          disabled={cobros.length <= 0}
          size="sm"
          onClick={() => excel()}
        >
          descargar excel
        </Button>
        {/* <span>filtra por estado:</span>
        <Button variant="primary" size="sm">
          pendiente
        </Button>
        <Button variant="success" size="sm">
          pagada
        </Button>
        <Button variant="danger" size="sm">
          vencida
        </Button> */}
      </div>
      <SimpleTable data={cobros} columns={columns} className="mt-5" />
    </>
  );
};

export default CobrosPage;
