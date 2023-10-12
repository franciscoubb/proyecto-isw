const Joi = require("joi");

const datosBodySchema = Joi.object({
    nombre: Joi.string().required().min(2).pattern(/^[\p{L}\s'-]+$/u).messages({
        "any.required": "El nombre es obligatorio",
        "string.empty": "El nombre no puede estar vacio",
        "string.base": "El nombre debe ser tipo string",
        "string.pattern.base": "El nombre debe contener solo letras",
        "string.min": "El nombre debe tener un minimo de 2 caracteres",
    }),
    rut: Joi.string().required().messages({
        "string.empty": "El rut no puede estar vacio",
        "any.required": "el rut es obligatorio",
    }),
    telefono: Joi.string().required().min(9).messages({
        "any.required": "El telefono es obligatorio",
        "string.empty": "El telefono no puede estar vacio",
        "string.min": "El telefono debe tener un minimo de 9 caracteres",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "El email no puede estar vacio",
        "any.required": "El email es obligatorio",
        "string.base": "El email debe ser de tipo string",
        "string.email": "El email debe tener un formato válido",
    }),
    userId: Joi.string().required().pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/).messages({
            "string.empty": "El id no puede estar vacío.",
            "any.required": "El id es obligatorio.",
            "string.base": "El id debe ser de tipo string.",
            "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    }),
});
const datosIdSchema = Joi.object({
    id: Joi.string()
      .required()
      .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
      .messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
        "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
      }),
  });

module.exports = { datosBodySchema, datosIdSchema };
