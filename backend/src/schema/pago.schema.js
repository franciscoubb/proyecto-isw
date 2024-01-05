"use strict";
const Joi = require("joi");

const pagoBodySchema = Joi.object({
  monto: Joi.number().required().min(0).messages({
    "any.required": "El monto es obligatorio",
    "number.min": "El monto no debe ser menor a 0",
    "number.base": "El monto debe ser un numero",
  }),
  fecha: Joi.date().min(new Date()).messages({
    "date.base": "La fecha debe ser una fecha válida",
    "date.min": "la fecha no puede ser anterior a la fecha actual",
  }),
  tipo: Joi.string().valid("abono", "pagoTotal").messages({
    "any.only": "El estado proporcionado no es válido.",
    "string.empty": "El estado no puede estar vacío.",
  }),
  estado: Joi.string()
    .valid("pendiente", "aceptado", "rechazado")
    .default("pendiente")
    .messages({
      "any.only": "El estado proporcionado no es válido.",
      "string.empty": "El estado no puede estar vacío.",
    }),
  cobroId: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El cobroId no puede estar vacío.",
      "any.required": "El cobroId es obligatorio.",
      "string.base": "El cobroId debe ser de tipo string.",
      "string.pattern.base":
        "El cobroId proporcionado no es un ObjectId válido.",
    }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
const pagoIdSchema = Joi.object({
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

module.exports = { pagoBodySchema, pagoIdSchema };
