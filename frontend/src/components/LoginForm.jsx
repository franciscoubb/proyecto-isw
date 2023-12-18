import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../services/auth.service";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data).then(() => {
      navigate("/");
    });
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="border rounded p-4 p-sm-3 shadow"
    >
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="name@example.com"
          autoComplete="username"
          {...register("email", {
            required: {
              value: true,
              message: "El email es requerido",
            },
          })}
        />

        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          autoComplete="current-password"
          {...register("password", {
            required: {
              value: true,
              message: "La contraseña es requerida",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          No deberias compartir tu datos con nadie
        </Form.Text>
      </Form.Group>
      <Button type="submit">Ingresar</Button>
    </Form>
  );
}

export default LoginForm;
