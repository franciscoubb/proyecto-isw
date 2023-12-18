const Joi = require("joi");

const deudorBodySchema = Joi.object({
    nombre: Joi.string().required().min(2).max(18).pattern(/^[A-Za-z]+( [A-Za-z]+)*$/).messages({
        "any.required": "El nombre es obligatorio",
        "string.empty": "El nombre no puede estar vacio",
        "string.base": "El nombre debe ser tipo string",
        "string.pattern.base": "El nombre debe contener solo letras",
        "string.min": "El nombre debe tener un minimo de 2 caracteres",
        "string.max": "El nombre no debe tener mas de 18 caracteres",
    }),
    apellido: Joi.string().required().min(2).max(20).pattern(/^[A-Za-z]+( [A-Za-z]+)*$/).messages({
        "any.required": "El apellido es obligatorio",
        "string.empty": "El apellido no puede estar vacio",
        "string.base": "El apellido debe ser tipo string",
        "string.pattern.base": "El apellido debe contener solo letras",
        "string.max": "El apellido no debe tener mas de 20 caracteres",
    }),
    rut: Joi.string()
    .required()
    .pattern(/^[0-9]+-[0-9kK]{1}$/)
    .messages({
        "string.empty": "El rut no puede estar vacio",
        "any.required": "el rut es obligatorio",
        "string.pattern.base": "El rut proporcionado no es un válido.",
    }),
    telefono: Joi.string().required().pattern(/^[0-9]+$/).min(9).messages({
        "any.required": "El telefono es obligatorio",
        "string.empty": "El telefono no puede estar vacio",
        "string.min": "El telefono debe tener un minimo de 9 caracteres",
        "string.pattern.base": "El telefono debe contener solo numeros",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "El email no puede estar vacío.",
        "any.required": "El email es obligatorio.",
        "string.base": "El email debe ser de tipo string.",
        "string.email": "El email debe tener un formato válido.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});
const deudorIdSchema = Joi.object({
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

module.exports = { deudorBodySchema, deudorIdSchema };
