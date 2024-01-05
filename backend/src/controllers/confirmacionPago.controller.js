"use Strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const ConfirmarPagoService = require("../services/confirmarPago.service");
const { handleError } = require("../utils/errorHandler");
const Pago = require("../models/pago.model.js");
const Cobro = require("../models/cobro.model.js");
const { enviarMail } = require("../helpers/mailer.js");
const correoTemplates = require("../helpers/correoTemplates.js");
const Deudor = require("../models/deudor.model");
/**
 * Obtiene todos los pagos sin confirmacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getPagosNoConfirmados(req, res) {
  try {
    const [pagos, errorPagos] =
      await ConfirmarPagoService.getPagosNoConfirmados();
    if (errorPagos) return respondError(req, res, 404, errorPagos);

    pagos.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, pagos);
  } catch (error) {
    handleError(error, "confirmacionPago.controller -> getPagosNoConfirmados");
    respondError(req, res, 400, error.message);
  }
}

/**
 * confirma un pago
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function confirmarPago(req, res) {
  try {
    const pago = await Pago.findByIdAndUpdate(
      req.params.id,
      { estado: "aprobado" },
      { new: true }, // Esto devuelve el documento actualizado
    );
    // verificar si el cobro existe
    const cobro = await Cobro.findById(pago.cobroId);
    if (!cobro) return respondError(req, res, 404, "El cobro no existe");
    const deudorId = cobro.deudorId;

    // Buscar el deudor por id
    const deudor = await Deudor.findById(deudorId);
    if (!deudor) {
      return respondError(req, res, 404, "El deudor no existe");
    }
    if (!pago) {
      return respondError(req, res, 404, "Pago no encontrado");
    }
    // Calcula el saldo pendiente (monto pendiente a pagar)
    // Verificar que el tipo de pago sea "abono" y el monto no sea mayor al saldo pendiente
    if (pago.tipo === "abono" && pago.monto > cobro.monto - cobro.montoPagado) {
      return respondError(
        req,
        res,
        400,
        "El monto de abono es mayor al saldo pendiente",
      );
    }

    const saldoPendiente = cobro.monto - pago.monto;
    if (saldoPendiente < 0) {
      return respondError(req, res, 404, "monto mayor a deuda pendiente");
    }
    // actualiza el monto pagado en el cobro
    cobro.montoPagado = cobro.montoPagado + pago.monto;

    // actualiza el estado si el saldo pendiente es igual a 0
    if (cobro.montoPagado === cobro.monto) {
      cobro.estado = "pagada";
    }
    await cobro.save();

    respondSuccess(req, res, 200, pago);
    const correo = correoTemplates.nuevoPago(deudor, pago);
    enviarMail(deudor.email, correo.asunto, correo.cuerpo);
  } catch (error) {
    handleError(error, "confirmacionPago.controller -> confirmarPago");
    respondError(req, res, 500, error.message);
  }
}

module.exports = {
  getPagosNoConfirmados,
  confirmarPago,
};
