import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { getDeudores } from "../services/deudor.service";
import { getCobros, updateCobro } from "../services/cobro.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
const EditCobroForm = ({ setCobros, show, onHide, cobros, cobroEditado }) => {
  dayjs.extend(utc);
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
      deudorId: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      console.log(cobroEditado._id);
      await updateCobro(cobroEditado._id, data);
      const updatedCobros = await getCobros();
      setCobros(updatedCobros);
      reset();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al crear el cobro:", error);
    }
  };
  const [deudores, setDeudores] = useState([]);
  useEffect(() => {
    getDeudores().then((data) => setDeudores(data));
  }, []);
  useEffect(() => {
    if (cobroEditado && cobroEditado.deudorId) {
      const initialValues = {
        tipoTramite: cobroEditado.tipoTramite || "",
        monto: cobroEditado.monto || "",
        plazoMaximoPago:
          dayjs.utc(cobroEditado.plazoMaximoPago).format("YYYY-MM-DD") || "",
        deudorId: cobroEditado.deudorId._id || "",
      };

      reset(initialValues);
    }
  }, [cobroEditado, reset]);

  const currentDate = dayjs().format("YYYY-MM-DD");
  const endOfYear = dayjs().endOf("year").format("YYYY-MM-DD");
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Actualiza Datos Cobro</Modal.Title>
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
                  <option value="tramite">tramite</option>
                  <option value="licencia">licencia</option>
                  <option value="multa">multa</option>
                  <option value="parte">parte</option>
                  <option value="basura">basura</option>
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
                min: {
                  value: 0.01,
                  message: "monto mayor a 0",
                },
              }}
              render={({ field }) => (
                <Form.Control
                  autoComplete="off"
                  isInvalid={errors.monto}
                  type="Number"
                  {...field}
                  placeholder="monto"
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
              }}
              render={({ field }) => (
                <Form.Control
                  isInvalid={errors.plazoMaximoPago}
                  type="date"
                  min={currentDate}
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
            <Form.Label>Deudor</Form.Label>
            <Controller
              name="deudorId"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Deudor es requerido",
                },
              }}
              render={({ field }) => (
                <Form.Select isInvalid={errors.deudorId} {...field}>
                  {deudores.length === 0 ? (
                    <option disabled>No hay deudores disponibles</option>
                  ) : (
                    <>
                      <option value="" disabled>
                        Seleccione el rut del deudor
                      </option>
                      {deudores.map((deudor) => (
                        <option key={deudor._id} value={deudor._id}>
                          {deudor.rut}
                        </option>
                      ))}
                    </>
                  )}
                </Form.Select>
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.deudorId?.message}
            </Form.Control.Feedback>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Actualizar
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

export default EditCobroForm;
