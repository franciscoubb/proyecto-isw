import { useState, useEffect } from "react";
import {
  getCobros,
  eliminarCobro,
  obtenerExcel,
} from "../services/cobro.service";
import RegistroCobroForm from "../components/RegistroCobroForm";
import SimpleTable from "../components/SimpleTable";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
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
      text: `No podrás revertir esto! cobro: ${JSON.stringify(cobro)}`,
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
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting cobro:", error);
        Swal.fire({
          title: "Error",
          text: "There was an error deleting the cobro.",
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
      header: "RUT DEUDOR",
      accessorKey: "deudorId.rut",
      footer: "Mi rut deudor",
    },
    {
      header: "TIPO TRAMITE",
      accessorKey: "tipoTramite",
      footer: "Mi tipo tramite",
    },
    {
      header: "MONTO",
      accessorKey: "monto",
      footer: "Mi monto",
      cell: (info) => {
        const cellValue = info.getValue();
        return Number(cellValue).toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        });
      },
    },
    {
      header: "VENCIMIENTO",
      accessorKey: "plazoMaximoPago",
      footer: "Mi vencimiento",
      cell: (info) => {
        return dayjs.utc(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "ESTADO",
      accessorKey: "estado",
      footer: "Mi estado",
      cell: (info) => {
        const cellValue = info.getValue();
        let textColorClass = "";
        if (cellValue === "pendiente") {
          textColorClass = "text-primary";
        } else if (cellValue === "vencida") {
          textColorClass = "text-danger";
        } else if (cellValue === "pagada") {
          textColorClass = "text-success";
        }

        return <span className={textColorClass}>{cellValue}</span>;
      },
    },
    {
      header: "FECHA EMISIÓN",
      accessorKey: "fechaEmision",
      footer: "Mi fecha emision",
      cell: (info) => {
        // console.log(info.getValue());
        return dayjs(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "ACCIONES",
      cell: ({ row }) => {
        const cobro = row.original;
        return (
          <div className="d-flex gap-2">
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => console.log(cobro, cobro._id)}
            >
              Editar
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => borrarCobro(cobro)}
            >
              Eliminar
            </Button>
          </div>
        );
      },
    },
  ];
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <h2>Lista de Cobros</h2>
      <div className="d-flex gap-2 mb-2">
        <Button size="sm" variant="primary" onClick={() => setModalShow(true)}>
          Nuevo Cobro
        </Button>
        <Button
          variant="success"
          disabled={cobros.length <= 0}
          size="sm"
          onClick={() => excel()}
        >
          descargar excel
        </Button>
      </div>
      <RegistroCobroForm
        setCobros={setCobros}
        cobros={cobros}
        onHide={() => setModalShow(false)}
        show={modalShow}
      />
      <SimpleTable data={cobros} columns={columns} />
    </>
  );
};

export default CobrosPage;
