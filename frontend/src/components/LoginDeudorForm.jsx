import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { login } from "../services/authDeudor.service";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { formatRut, cleanRut, validateRut } from "rutlib";
function LoginForm() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      rut: "",
    },
  });

  const onSubmit = (data) => {
    data.rut = formatRut(data.rut, false);
    login(data).then(() => {
      navigate("/deudor");
    });
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
              message: "el rut es obligatorio",
            },
            validate: {
              ValidaRut: (fieldValue) => {
                const esValido = validateRut(fieldValue);
                return esValido || "Rut no válido";
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
      </Form.Group>
      <Button type="submit">Ingresar</Button>
    </Form>
  );
}

export default LoginForm;
