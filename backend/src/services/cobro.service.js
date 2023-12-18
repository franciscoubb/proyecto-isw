// const User = require("../models/user.model.js");
const Deudor = require("../models/deudor.model.js");
const Cobro = require("../models/cobro.model.js");
const { handleError } = require("../utils/errorHandler.js");
const { enviarMail } = require("../helpers/mailer.js");
const correoTemplates = require("../helpers/correoTemplates.js");
const Pago = require("../models/pago.model.js");
/**
 * Obtiene todos los cobros de la base de datos
 * @returns {Promise} Promesa con el objeto de los cobros
 */
async function getCobros() {
  try {
    const cobros = await Cobro.find().populate("deudorId").exec();
    if (!cobros) return [null, "No hay cobros"];

    return [cobros, null];
  } catch (error) {
    handleError(error, "cobro.service -> getCobros");
  }
}

/**
 * Crea un nuevo cobro en la base de datos
 * @param {Object} user Objeto de cobro
 * @returns {Promise} Promesa con el objeto de cobro creado
 */
async function createCobro(cobro) {
  try {
    const { tipoTramite, monto, plazoMaximoPago, deudorId } = cobro;
    const nuevoCobro = new Cobro({
      tipoTramite,
      monto,
      plazoMaximoPago,
      deudorId,
    });
    await nuevoCobro.save();
    const deudor = await Deudor.findById({ _id: deudorId });
    const correo = correoTemplates.nuevaDeuda(deudor, nuevoCobro);
    enviarMail(deudor.email, correo.asunto, correo.cuerpo);
    return [nuevoCobro, null];
  } catch (error) {
    handleError(error, " cobro.service -> createCobro");
  }
}

/**
 * Obtiene un cobro por su id de la base de datos
 * @param {string} Id del cobro
 * @returns {Promise} Promesa con el objeto de cobro
 */
async function getCobroById(id) {
  try {
    const cobro = await Cobro.findById({ _id: id }).populate("deudorId");
    if (!cobro) return [null, "El cobro no existe"];

    return [cobro, null];
  } catch (error) {
    handleError(error, "cobro.service -> getCobroById");
  }
}
/**
 * Obtiene todos los cobros de un deudor especifico
 * @param {string} Id del cobro
 * @returns {Promise} Promesa con el objeto de cobro
 */
async function getCobrosByDeudorId(id) {
  try {
    // primero obtenemos el deudor por su ID
    const deudor = await Deudor.findById(id);
    if (!deudor) return [null, "El Deudor no existe"];
    // luego obtenemos lo cobros relacionado con el deudor
    const cobros = await Cobro.find({ deudorId: id });
    const cobrosByDeudorId = { deudor, cobros };
    return [cobrosByDeudorId, null];
  } catch (error) {
    handleError(error, "cobro.service -> getCobroById");
  }
}
/**
 * Obtiene todos los pagos de un cobro especifico
 * @param {string} Id del cobro
 * @returns {Promise} Promesa con el objeto de cobro
 */
async function getPagosByCobroId(id) {
  try {
    const cobro = await Cobro.findById(id);
    if (!cobro) return [null, "No existen el cobro"];
    const pagos = await Pago.find({ cobroId: id });
    if (!pagos) return [null, "El cobro no registra pagos"];
    const pagoByCobroId = {
      deudorId: cobro.deudorId,
      cobroId: cobro._id,
      pagos,
    };
    return [pagoByCobroId, null];
  } catch (error) {
    handleError(error, "cobro.service -> getPagosByCobroId");
  }
}
/**
 * Actualiza un cobro por su id en la base de datos
 * @param {string} id Id del cobro
 * @param {Object} user Objeto de cobro
 * @returns {Promise} Promesa con el objeto de cobro actualizado
 */
async function updateCobro(id, cobro) {
  try {
    const cobroFound = await Cobro.findById(id);
    if (!cobroFound) return [null, "El cobro no existe"];

    const { tipoTramite, monto, plazoMaximoPago } = cobro;
    const cobroUpdate = await Cobro.findByIdAndUpdate(
      id,
      {
        tipoTramite,
        monto,
        plazoMaximoPago,
      },
      { new: true },
    );

    return [cobroUpdate, null];
  } catch (error) {
    handleError(error, "cobro.service -> updateCobro");
  }
}

/**
 * Elimina un cobro por su id de la base de datos
 * @param {string} Id del cobro
 * @returns {Promise} Promesa con el objeto de cobro eliminado
 */
async function deleteCobro(id) {
  try {
    return await Cobro.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "cobro.service -> deleteCobro");
  }
}

module.exports = {
  createCobro,
  getCobros,
  getCobroById,
  updateCobro,
  deleteCobro,
  getPagosByCobroId,
  getCobrosByDeudorId,
};
