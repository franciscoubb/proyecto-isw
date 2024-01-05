"use strict";
const { handleError } = require("../utils/errorHandler");
const { respondSuccess, respondError } = require("../utils/resHandler");
const Cobro = require("../models/cobro.model.js");
const { cobroIdSchema } = require("../schema/cobro.schema.js");
const Pago = require("../models/pago.model");
const { pagoBodySchema } = require("../schema/pago.schema.js");

// const { enviarMail } = require("../helpers/mailer.js");
// const correoTemplates = require("../helpers/correoTemplates.js");
// const Deudor = require("../models/deudor.model");
/**
 * Obtiene todos las deudas del usuario autenticado
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getMisDeudas(req, res) {
  try {
    const idDeudor = req.id;
    const cobros = await Cobro.find({ deudorId: idDeudor }).populate(
      "deudorId",
    );
    cobros.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, cobros);
  } catch (error) {
    handleError(error, "misDeudas.controller -> getMisDeudas");
    respondError(req, res, 400, error.message);
  }
}
/**
 * Obtiene una deuda por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getMisDeudasByid(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = cobroIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);
    const cobro = await Cobro.findById({ _id: params.id }).populate("deudorId");
    if (!cobro) return respondError(req, res, 404, "El cobro no existe");
    respondSuccess(req, res, 200, cobro);
  } catch (error) {
    handleError(error, "misDeudas.controller -> getMisDeudasByid");
    respondError(req, res, 500, "No se pudo obtener la deuda");
  }
}

/**
 * Crea un nuevo pago
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createPago(req, res) {
  try {
    const { body } = req;
    // const { id } = req;
    const { error: bodyError } = pagoBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);
    const { cobroId, monto, tipo } = req.body;
    if (typeof body.monto !== "number") {
      return respondError(
        req,
        res,
        400,
        "El campo 'monto' debe ser un número.",
      );
    }
    // verificar si el cobro existe
    const cobro = await Cobro.findById(body.cobroId);
    if (!cobro) return respondError(req, res, 404, "El cobro no existe");
    // Calcula el saldo pendiente (monto pendiente a pagar)
    // Verificar que el tipo de pago sea "abono" y el monto no sea mayor al saldo pendiente
    if (tipo === "abono" && monto > cobro.monto - cobro.montoPagado) {
      return respondError(
        req,
        res,
        400,
        "El monto de abono es mayor al saldo pendiente",
      );
    }

    const saldoPendiente = cobro.monto - monto;
    if (saldoPendiente < 0) {
      return respondError(req, res, 404, "monto mayor a deuda pendiente");
    }
    // // actualiza el monto pagado en el cobro
    // cobro.montoPagado = cobro.montoPagado + monto;

    // // actualiza el estado si el saldo pendiente es igual a 0
    // if (cobro.montoPagado === cobro.monto) {
    //   cobro.estado = "pagada";
    // }

    await cobro.save();
    const nuevoPago = new Pago({
      cobroId,
      monto,
      tipo,
    });
    await nuevoPago.save();
    if (!nuevoPago) {
      return respondError(req, res, 400, "No se creo el pago");
    }
    respondSuccess(req, res, 201, nuevoPago);

    // const deudor = await Deudor.findById({ _id: id });
    // const correo = correoTemplates.nuevoPago(deudor, nuevoPago);
    // enviarMail(deudor.email, correo.asunto, correo.cuerpo);
  } catch (error) {
    handleError(error, "misDeudas.controller -> createPago");
    respondError(req, res, 500, "No se creo el pago");
  }
}

module.exports = {
  getMisDeudas,
  getMisDeudasByid,
  createPago,
};
