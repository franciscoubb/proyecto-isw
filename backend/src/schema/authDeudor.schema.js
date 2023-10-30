"use strict";

const Joi = require("joi");

/**
 * Esquema de validación para el cuerpo de la solicitud de inicio de sesión del deudor.
 * @constant {Object}
 */
const authDeudorLoginBodySchema = Joi.object({
    rut: Joi.string()
    .required()
    .pattern(/^[0-9]+-[0-9kK]{1}$/)
    .messages({
        "string.empty": "El rut no puede estar vacio",
        "any.required": "el rut es obligatorio",
        "string.pattern.base": "El rut proporcionado no es un válido.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

module.exports = { authDeudorLoginBodySchema };
