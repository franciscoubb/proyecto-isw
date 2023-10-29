"use strict";
const TRAMITES = require("../constants/tramites.constants");
const Joi = require("joi");

const cobroBodySchema = Joi.object({
    tipoTramite: Joi.string().required().valid(...TRAMITES).messages({
        "any.required": "El tipo de tramite es obligatorio",
        "any.only": "El tipo de trámite proporcionado no es válido.",
        "string.empty": "El tipo de trámite no puede estar vacío.",
    }),
    monto: Joi.number().required().min(0).messages({
        "any.required": "El monto es obligatorio",
        "number.min": "El monto no debe ser menor a 0",
        "number.base": "El monto debe ser un numero",
    }),
    plazoMaximoPago: Joi.date().required().min(new Date).messages({
        "date.empty": "El plazo no puede estar vacio",
        "date.base": "El plazo debe ser una fecha válida",
        "date.min": "El plazo no puede ser anterior a la fecha actual",
        "any.required": "El plazo maximo es obligatorio",
    }),
    estado: Joi.string().valid("pendiente", "vencida", "pagada").default("pendiente").messages({
        "any.only": "El estado proporcionado no es válido.",
        "string.empty": "El estado no puede estar vacío.",
    }),
    // fechaEmision: Joi.date().required().min(new Date).messages({
    //     "date.empty": "El plazo no puede estar vacio",
    //     "date.base": "El plazo debe ser una fecha válida",
    //     "date.min": "El plazo no puede ser anterior a la fecha actual",
    //     "any.required": "El plazo maximo es obligatorio",
    // }),
    deudorId: Joi.string().required().pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/).messages({
        "string.empty": "El deudorId no puede estar vacío.",
        "any.required": "El deudorId es obligatorio.",
        "string.base": "El deudorId debe ser de tipo string.",
        "string.pattern.base": "El deudorId proporcionado no es un ObjectId válido.",
    }),
    // usuarioId: Joi.string().required().pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/).messages({
    //     "string.empty": "El usuarioId no puede estar vacío.",
    //         "any.required": "El usuarioId es obligatorio.",
    //         "string.base": "El usuarioId debe ser de tipo string.",
    //         "string.pattern.base": "El usuarioId proporcionado no es un ObjectId válido.",
    // }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});
const cobroIdSchema = Joi.object({
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

module.exports = { cobroBodySchema, cobroIdSchema };
