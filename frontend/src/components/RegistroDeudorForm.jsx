import { useForm, Controller } from "react-hook-form";
import { createDeudor } from "../services/deudor.service";
import Swal from "sweetalert2";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { formatRut, cleanRut, validateRut, compareRuts } from "rutlib";
const RegistroDeudorForm = ({ setDeudores, deudores, show, onHide }) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      rut: "",
      telefono: "",
      email: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      data.rut = formatRut(data.rut, false);
      await createDeudor(data);
      setDeudores([data, ...deudores]);
      reset();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Deudor/a Registrad@ correctamente",
        showConfirmButton: true,
      });
    } catch (error) {
      console.error("Error al crear el deudor", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Ingrese Datos Deudor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "el nombre es obligatorio",
                },
                minLength: {
                  value: 2,
                  message: "Nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 18,
                  message: "Nombre debe no debe ser mayor a 18 caracteres",
                },
                pattern: {
                  value: /^[A-Za-z]+( [A-Za-z]+)*$/,
                  message: "Nombre no valido",
                }, //espacios en blanco
              }}
              render={({ field }) => (
                <Form.Control
                  autoComplete="off"
                  isInvalid={errors.nombre}
                  type="text"
                  {...field}
                  placeholder="nombre"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">ingrese sin tildes</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Controller
              name="apellido"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Apellido es requerido",
                },
                minLength: {
                  value: 2,
                  message: "Nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 18,
                  message: "Nombre debe no debe ser mayor a 18 caracteres",
                },
                pattern: {
                  value: /^[A-Za-z]+( [A-Za-z]+)*$/,
                  message: "Apellido no valido",
                },
              }}
              render={({ field }) => (
                <Form.Control
                  autoComplete="off"
                  isInvalid={errors.apellido}
                  type="text"
                  {...field}
                  placeholder="apellido"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.apellido?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">ingrese sin tildes</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>RUT</Form.Label>
            <Controller
              name="rut"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Rut es requerido",
                },
                validate: {
                  ValidaRut: (fieldValue) => {
                    const esValido = validateRut(fieldValue);
                    return esValido || "Rut no válido";
                  },
                  existeRut: (fieldValue) => {
                    if (!deudores) return true;
                    const rutExists = deudores.some((deudor) =>
                      compareRuts(fieldValue, deudor.rut)
                    );
                    return !rutExists || "RUT ya registrado";
                  },
                },
              }}
              render={({ field }) => (
                <Form.Control
                  autoComplete="off"
                  isInvalid={errors.rut}
                  type="text"
                  {...field}
                  placeholder="0.000.000-0"
                  onChange={(e) => {
                    const sinMascara = cleanRut(e.target.value);
                    const masaca = formatRut(sinMascara);
                    field.onChange(masaca);
                  }}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.rut?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              ingrese sin puntos ni guión
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>N° Celular +56</Form.Label>
            <Controller
              name="telefono"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Telefono es requerido",
                },
                pattern: {
                  value: /^9\d{8}$/g,
                  message:
                    "Telefono no valido debe comenzar con un 9 y contener 9 digitos",
                },
                minLength: {
                  value: 9,
                  message: "El teléfono debe tener exactamente 9 digitos",
                },
                maxLength: {
                  value: 9,
                  message: "El teléfono debe tener exactamente 9 digitos",
                },
              }}
              render={({ field }) => (
                <Form.Control
                  autoComplete="off"
                  isInvalid={errors.telefono}
                  type="text"
                  {...field}
                  placeholder="teléfono"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.telefono?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              9 digitos y comience con un 9
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Email es requerido",
                },
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Email no válido",
                },
              }}
              render={({ field }) => (
                <Form.Control
                  autoComplete="off"
                  isInvalid={errors.email}
                  type="email"
                  {...field}
                  placeholder="email"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Debe ser válido para notificar
            </Form.Text>
          </Form.Group>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Registrar
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegistroDeudorForm;
