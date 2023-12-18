"use strict";
const TRAMITES = require("../constants/tramites.constants");
const Joi = require("joi");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const currentYear = new Date().getFullYear();

const cobroBodySchema = Joi.object({
  tipoTramite: Joi.string()
    .required()
    .valid(...TRAMITES)
    .messages({
      "any.required": "El tipo de tramite es obligatorio",
      "any.only": "El tipo de trámite proporcionado no es válido.",
      "string.empty": "El tipo de trámite no puede estar vacío.",
    }),
  monto: Joi.number().required().min(1).messages({
    "any.required": "El monto es obligatorio",
    "number.min": "El monto no debe ser menor a 0",
    "number.base": "El monto debe ser un numero",
  }),
  plazoMaximoPago: Joi.date()
    .required()
    .min(dayjs().tz("America/Santiago").startOf("day").toDate())
    .max(dayjs().tz("America/Santiago").endOf("year").startOf("day").toDate())
    .messages({
      "date.empty": "El plazo no puede estar vacio",
      "date.base": "El plazo debe ser una fecha válida",
      "date.min": "El plazo no puede ser anterior a la fecha actual",
      "any.required": "El plazo maximo es obligatorio",
      "date.max": `La fecha no puede ser posterior al final del año ${currentYear}`,
    }),
  estado: Joi.string()
    .valid("pendiente", "vencida", "pagada")
    .default("pendiente")
    .messages({
      "any.only": "El estado proporcionado no es válido.",
      "string.empty": "El estado no puede estar vacío.",
    }),
  montoPagado: Joi.number().min(0).default(0).messages({
    "number.min": "El monto no debe ser negativo",
    "number.base": "El monto debe ser un numero",
  }),
  fechaEmision: Joi.date().default(new Date()).min(new Date()).messages({
    "date.base": "El plazo debe ser una fecha válida",
    "date.min": "La fecha emision no puede ser anterior a la fecha actual",
  }),
  deudorId: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El deudorId no puede estar vacío.",
      "any.required": "El deudorId es obligatorio.",
      "string.base": "El deudorId debe ser de tipo string.",
      "string.pattern.base":
        "El deudorId proporcionado no es un ObjectId válido.",
    }),
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
