// const User = require("../models/user.model.js");
const { handleError } = require("../utils/errorHandler.js");
// const { enviarMail } = require("../helpers/mailer.js");
// const correoTemplates = require("../helpers/correoTemplates.js");
const Pago = require("../models/pago.model.js");
/**
 * Obtiene todos los cobros de la base de datos
 * @returns {Promise} Promesa con el objeto de los pago no confirmados
 */
async function getPagosNoConfirmados() {
  try {
    const pagos = await Pago.find({ estado: "pendiente" });
    if (!pagos) return [null, "No hay pagos no confirmados"];

    return [pagos, null];
  } catch (error) {
    handleError(error, "confirmarpago.service -> getPagosNoConfirmados");
  }
}
/**
 * Actualiza un estado de un pago por su id en la base de datos
 * @param {string} id Id del cobro
 * @param {Object} user Objeto de cobro
 * @returns {Promise} Promesa con el objeto de cobro actualizado
 */
// async function updatePago(id, estado) {
//   try {
//     const cobroFound = await Cobro.findById(id);
//     if (!cobroFound) return [null, "El cobro no existe"];

//     const { tipoTramite, monto, plazoMaximoPago } = cobro;
//     const cobroUpdate = await Cobro.findByIdAndUpdate(
//       id,
//       {
//         tipoTramite,
//         monto,
//         plazoMaximoPago,
//       },
//       { new: true },
//     );

//     return [cobroUpdate, null];
//   } catch (error) {
//     handleError(error, "cobro.service -> updateCobro");
//   }
// }

module.exports = {
  getPagosNoConfirmados,
};
