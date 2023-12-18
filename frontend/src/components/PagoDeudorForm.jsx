import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { createPago } from "../services/deudores.service";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import currencyFormatter from "currency-formatter";
const PagoDeudorForm = ({ cobro, setCobro }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [montoEnabled, setMontoEnabled] = useState(false);
  const handleMontoChange = (e) => {
    const sinFormato = currencyFormatter.unformat(e.target.value, {
      code: "CLP",
    });
    const monto = currencyFormatter.format(sinFormato, { code: "CLP" });
    setValue("monto", monto);
  };
  const onSubmit = async (data) => {
    data.cobroId = cobro._id;
    if (data.tipo === "pagoTotal") {
      data.monto = cobro.monto - cobro.montoPagado;
    } else {
      data.monto = currencyFormatter.unformat(data.monto, {
        code: "CLP",
      });
    }

    await createPago(data);
    reset();
    Swal.fire({
      title: "Procesando pago...",
      html: "Por favor espere un momento...",
      allowConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setTimeout(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Pago exitoso, detalles enviados a ${cobro.deudorId.email}`,
        showConfirmButton: true,
        allowOutsideClick: false,
      });
      setCobro({
        ...cobro,
        montoPagado: cobro.montoPagado + data.monto,
      });
      navigate("/deudor");
    }, 2500);
  };

  return (
    <>
      <h2 className="text-center">Elige el monto a pagar</h2>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3 p-2">
          <Form.Check
            type="radio"
            value="pagoTotal"
            isInvalid={errors.tipo}
            label={`Totalidad ${Number(
              cobro.monto - cobro.montoPagado
            ).toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}`}
            {...register("tipo", {
              required: {
                value: true,
                message: "tipo es requerido",
              },
            })}
            onClick={() => {
              setMontoEnabled(false);
              reset({ monto: "" }); // Limpiar el input de monto
            }}
          />
          <Form.Check
            type="radio"
            isInvalid={errors.tipo}
            value="abono"
            label="Otro monto"
            {...register("tipo", {
              required: {
                value: true,
                message: "tipo es requerido",
              },
            })}
            onClick={() => setMontoEnabled(true)}
          />
          {errors.tipo && (
            <Form.Control.Feedback type="invalid">
              {errors.tipo.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3 p-2">
          <Form.Control
            className="w-100"
            autoComplete="off"
            type="string"
            placeholder="$0"
            isInvalid={errors.monto}
            {...register("monto", {
              required: montoEnabled ? "el monto es requerido" : false,
              validate: (fieldValue) => {
                const sinFormato = currencyFormatter.unformat(fieldValue, {
                  code: "CLP",
                });
                if (montoEnabled) {
                  if (sinFormato > cobro.monto - cobro.montoPagado) {
                    return "monto mayor a la deuda";
                  }
                  if (sinFormato === cobro.monto - cobro.montoPagado) {
                    return "prefiera seleccionar monto total";
                  }
                }
              },
            })}
            disabled={!montoEnabled}
            onChange={handleMontoChange}
          />
          {errors.monto && (
            <Form.Control.Feedback type="invalid">
              {errors.monto.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Button type="submit" className="w-100" variant="outline-success">
          Pagar
        </Button>
      </Form>
    </>
  );
};

export default PagoDeudorForm;
