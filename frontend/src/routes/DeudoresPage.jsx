import { useState, useEffect } from "react";
import { getDeudores, deleteDeudor } from "../services/deudor.service";
import RegistroDeudorForm from "../components/RegistroDeudorForm";
import EditDeudorForm from "../components/EditDeudorForm";
import SimpleTable from "../components/SimpleTable";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
const DeudoresPage = () => {
  const [deudores, setDeudores] = useState([]);
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
  const borrarDeudor = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
      });

      if (result.isConfirmed) {
        const deleteResult = await deleteDeudor(id);

        if (deleteResult.success) {
          const filtradoDeudor = deudores.filter((deudor) => deudor._id !== id);
          setDeudores(filtradoDeudor);
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "El deudor se eliminó correctamente.",
          });
        } else {
          // Mostrar mensaje de advertencia si hay cobros asociados
          Swal.fire({
            title: "Advertencia",
            text: deleteResult.message,
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
    console.log(deudor);
    setDeudorEditado(deudor);
    setEditModalShow(true);
  };

  const columns = [
    {
      header: "NOMBRE",
      accessorKey: "nombre",
      footer: "Mi nombre",
    },
    {
      header: "APELLIDO",
      accessorKey: "apellido",
      footer: "Mi apellido",
    },
    {
      header: "RUT",
      accessorKey: "rut",
      footer: "Mi rut",
    },
    {
      header: "TELEFONO",
      accessorKey: "telefono",
      footer: "Mi telefono",
    },
    {
      header: "EMAIL",
      accessorKey: "email",
      footer: "Mi email",
    },
    {
      header: "ACCIONES",
      cell: ({ row }) => {
        const deudor = row.original;
        return (
          <div className="d-flex gap-2">
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => editarDeudor(deudor)}
            >
              Editar
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => borrarDeudor(deudor._id)}
            >
              Eliminar
            </Button>
          </div>
        );
      },
    },
  ];
  const [modalShow, setModalShow] = useState(false);
  const [EditModalShow, setEditModalShow] = useState(false);
  const [deudorEditado, setDeudorEditado] = useState({});
  return (
    <>
      <h2>Lista de Deudores</h2>
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
