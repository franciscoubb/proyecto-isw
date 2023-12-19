import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { login } from "../services/authDeudor.service";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { formatRut, cleanRut, validateRut } from "rutlib";
import { useState } from "react";
function LoginForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      rut: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      data.rut = formatRut(data.rut, false);
      await login(data);
      navigate("/deudor");
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <Form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="border rounded p-4 p-sm-3 shadow"
    >
      <Form.Group className="mb-3">
        <Form.Label>Rut</Form.Label>
        <Controller
          name="rut"
          control={control}
          rules={{
            required: {
              value: true,
              message: "RUT es obligatorio",
            },
            validate: {
              ValidaRut: (fieldValue) => {
                const esValido = validateRut(fieldValue);
                return esValido || "RUT no válido";
              },
              ValidaMin: (fieldValue) => {
                const sinMascara = cleanRut(fieldValue);
                const isValidLength =
                  sinMascara.length === 8 || sinMascara.length === 9;
                return isValidLength || "RUT no válido";
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
                if (e.target.value == "-") {
                  return field.onChange("");
                }
                const isValidLength =
                  sinMascara.length <= 9 && sinMascara.length >= 1;
                if (isValidLength) {
                  const mascara = formatRut(e.target.value);
                  field.onChange(mascara);
                }
              }}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.rut?.message}
        </Form.Control.Feedback>
      </Form.Group>
      {serverError && <div className="text-danger mb-3">{serverError}</div>}
      <Button type="submit">Ingresar</Button>
    </Form>
  );
}

export default LoginForm;
