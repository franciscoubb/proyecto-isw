import { useForm, Controller } from "react-hook-form";
import { createCobro } from "../services/cobro.service";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import currencyFormatter from "currency-formatter";
import { formatRut } from "rutlib";
dayjs.extend(customParseFormat);
const RegistroCobroForm = ({ deudorSeleccionado, show, onHide }) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      tipoTramite: "",
      monto: "",
      plazoMaximoPago: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      data.monto = currencyFormatter.unformat(data.monto, {
        code: "CLP",
      });
      data.deudorId = deudorSeleccionado._id;
      await createCobro(data);
      reset();
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Deuda registrada notificación enviada a ${deudorSeleccionado.email}`,
        showConfirmButton: true,
      });
    } catch (error) {
      console.error("Error al crear la deuda:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al crear deuda.",
        icon: "error",
      });
    }
  };

  const endOfYear = dayjs().endOf("year").format("YYYY-MM-DD");
  const minVencimiento = dayjs().add(1, "day").format("YYYY-MM-DD"); // Corrige la forma de usar add
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Ingrese Datos Deuda</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Tramite</Form.Label>
            <Controller
              name="tipoTramite"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Tipo Tramite es requerido",
                },
              }}
              render={({ field }) => (
                <Form.Select isInvalid={errors.tipoTramite} {...field}>
                  <option value="" disabled>
                    Seleccione tipo de tramite a pagar
                  </option>
                  <option value="tramite">trámite</option>
                  <option value="licencia">licencia</option>
                  <option value="multa">multa de tránsito</option>
                  <option value="parte">parte</option>
                  <option value="basura">basura (retiro de basura)</option>
                  <option value="permiso circulacion">
                    permiso de circulación
                  </option>
                </Form.Select>
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tipoTramite?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Controller
              name="monto"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "monto es requerido",
                },
                validate: {
                  validaMax: (fieldValue) => {
                    const montoSinMascara = currencyFormatter.unformat(
                      fieldValue,
                      {
                        code: "CLP",
                      }
                    );
                    const maxAmount = 5000000000000000;

                    return (
                      montoSinMascara <= maxAmount ||
                      `El monto no puede ser mayor a ${currencyFormatter.format(
                        maxAmount,
                        { code: "CLP" }
                      )}`
                    );
                  },
                  validaMin: (fieldValue) => {
                    const montoSinMascara = currencyFormatter.unformat(
                      fieldValue,
                      {
                        code: "CLP",
                      }
                    );
                    const minAmount = 0;
                    return (
                      montoSinMascara > minAmount ||
                      `Debe ingresar un monto mayor a $0`
                    );
                  },
                },
              }}
              render={({ field }) => (
                <Form.Control
                  autoComplete="off"
                  isInvalid={errors.monto}
                  type="string"
                  {...field}
                  placeholder="monto"
                  onChange={(e) => {
                    const sinFormato = currencyFormatter.unformat(
                      e.target.value,
                      {
                        code: "CLP",
                      }
                    );
                    const conFormato = currencyFormatter.format(sinFormato, {
                      code: "CLP",
                    });
                    field.onChange(conFormato);
                  }}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.monto?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vencimiento</Form.Label>
            <Controller
              name="plazoMaximoPago"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "vencimiento es requerido",
                },
                validate: (fieldValue) => {
                  const selectedDate = dayjs(fieldValue);
                  if (!selectedDate.isValid()) {
                    // Manejar el caso en que la fecha no sea válida
                    return "Por favor, selecciona una fecha válida.";
                  }
                  const today = dayjs().startOf("day");
                  if (selectedDate.isBefore(today.add(1, "day"))) {
                    return "La fecha debe ser mayor o igual a hoy más un día.";
                  }
                  if (selectedDate.isAfter(endOfYear)) {
                    return "La fecha no puede ser después del final del año.";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <Form.Control
                  isInvalid={errors.plazoMaximoPago}
                  type="date"
                  min={minVencimiento}
                  max={endOfYear}
                  {...field}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.plazoMaximoPago?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Deudor: </Form.Label>
            <br></br>
            <b>Nombre: </b>
            {deudorSeleccionado?.nombre} {deudorSeleccionado?.apellido}
            <br></br>
            <b>RUT: </b>
            {formatRut(deudorSeleccionado?.rut)}
            <br></br>
            <b>Teléfono: </b>
            {deudorSeleccionado?.telefono}
            <br></br>
            <b>Email: </b>
            {deudorSeleccionado?.email}
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Registrar
              </Button>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegistroCobroForm;
