import { useState, useEffect } from "react";
import { getDeudores, deleteDeudor } from "../services/deudor.service";
import RegistroDeudorForm from "../components/RegistroDeudorForm";
import EditDeudorForm from "../components/EditDeudorForm";
import SimpleTable from "../components/SimpleTable";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import RegistroCobroForm from "../components/RegistroCobroForm";
const DeudoresPage = () => {
  const [deudores, setDeudores] = useState([]);
  const [deudorSeleccionado, setDeudorSeleccionado] = useState(null);
  useEffect(() => {
    traerDeudores();
  }, []);
  const traerDeudores = async () => {
    try {
      const deudores = await getDeudores();
      setDeudores(deudores);
    } catch (error) {
      console.error(error.message);
    }
  };
  const borrarDeudor = async (deudor) => {
    try {
      const { _id } = deudor;
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        html: `¡No podrás revertir esto! </br><b>Deudor:</b> ${deudor.nombre} ${deudor.apellido}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, eliminarlo",
      });

      if (result.isConfirmed) {
        const deleteResult = await deleteDeudor(_id);

        if (deleteResult.success) {
          const filtradoDeudor = deudores.filter(
            (deudor) => deudor._id !== _id
          );
          setDeudores(filtradoDeudor);
          Swal.fire({
            icon: "success",
            title: "Eliminado!",
            text: "El deudor se eliminó correctamente.",
          });
        } else {
          // Mostrar mensaje de advertencia si hay cobros asociados
          Swal.fire({
            title: "Advertencia",
            html: `No es posible eliminar</br>${deleteResult.message}`,
            icon: "warning",
          });
        }
      }
    } catch (error) {
      console.error("Error al eliminar deudor:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al eliminar el deudor.",
        icon: "error",
      });
    }
  };
  const editarDeudor = (deudor) => {
    setDeudorEditado(deudor);
    setEditModalShow(true);
  };

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Apellido",
      accessorKey: "apellido",
    },
    {
      header: "RUT",
      accessorKey: "rut",
    },
    {
      header: "Teléfono",
      accessorKey: "telefono",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const deudor = row.original;
        return (
          <div className="d-flex flex-column flex-sm-row align-items-start">
            <Button
              variant="outline-warning"
              size="sm"
              className="mb-2 mb-sm-0 me-sm-2 w-100"
              onClick={() => editarDeudor(deudor)}
            >
              Editar
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="mb-2 mb-sm-0 me-sm-2 w-100"
              onClick={() => borrarDeudor(deudor)}
            >
              Eliminar
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              className="w-100"
              onClick={() => {
                setModalCobroShow(true);
                setDeudorSeleccionado(deudor);
              }}
            >
              +Deuda
            </Button>
          </div>
        );
      },
    },
  ];
  const [modalShow, setModalShow] = useState(false);
  const [EditModalShow, setEditModalShow] = useState(false);
  const [deudorEditado, setDeudorEditado] = useState({});
  const [modalCobroShow, setModalCobroShow] = useState(false);

  return (
    <>
      <h2>Lista de Deudores y asignación de deuda</h2>
      <Button
        variant="primary"
        className="mb-2"
        size="sm"
        onClick={() => setModalShow(true)}
      >
        Nuevo Deudor
      </Button>
      <RegistroDeudorForm
        setDeudores={setDeudores}
        deudores={deudores}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <RegistroCobroForm
        // setCobros={setCobros}
        // cobros={cobros}
        onHide={() => setModalCobroShow(false)}
        show={modalCobroShow}
        deudorSeleccionado={deudorSeleccionado}
      />
      <EditDeudorForm
        show={EditModalShow}
        onHide={() => {
          setEditModalShow(false);
        }}
        deudorEditado={deudorEditado}
        setDeudores={setDeudores}
        deudores={deudores}
      />
      <SimpleTable data={deudores} columns={columns} className="mt-5" />
    </>
  );
};

export default DeudoresPage;
