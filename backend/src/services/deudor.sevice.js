const Deudor = require("../models/deudor.model.js");
const Cobro = require("../models/cobro.model.js");
const { handleError } = require("../utils/errorHandler.js");

/**
 * Crea un nuevo cobro en la base de datos
 * @param {Object} user Objeto de cobro
 * @returns {Promise} Promesa con el objeto de cobro creado
 */
async function createDeudor(deudor) {
  try {
    const { nombre, apellido, rut, telefono, email } = deudor;
    const nuevoDeudor = new Deudor({
      nombre,
      apellido,
      rut,
      telefono,
      email,
    });
    const deudorRutFound = await Deudor.findOne({ rut: deudor.rut });

    if (deudorRutFound) return [null, "El rut ya existe"];

    await nuevoDeudor.save();
    return [nuevoDeudor, null];
  } catch (error) {
    handleError(error, " deudor.service -> createService");
  }
}
/**
 * Obtiene todos los deudores de la base de datos
 * @returns {Promise} Promesa con el objeto de los cobros
 */
async function getDeudores() {
  try {
    const deudores = await Deudor.find();
    if (!deudores) return [null, "No hay deudores"];

    return [deudores, null];
  } catch (error) {
    handleError(error, "deudor.service -> getdeudores");
  }
}
/**
 * Elimina un deudor por su id de la base de datos
 * @param {string} Id del cobro
 * @returns {Promise} Promesa con el objeto de cobro eliminado
 */
async function deleteDeudor(id) {
  try {
    const cobroFound = await Cobro.findOne({ deudorId: id });
    if (cobroFound) return [null, "El deudor tiene cobros asociados"];
    return await Deudor.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "deudor.service -> deleteDeudor");
  }
}
/**
 * Obtiene un cobro por su id de la base de datos
 * @param {string} Id del cobro
 * @returns {Promise} Promesa con el objeto de cobro
 */
async function getDeudorById(id) {
  try {
    const deudor = await Deudor.findById({ _id: id });
    if (!deudor) return [null, "El deudor no existe"];

    return [deudor, null];
  } catch (error) {
    handleError(error, "deudor.service -> getDeudorById");
  }
}
/**
 * Actualiza un cobro por su id en la base de datos
 * @param {string} id Id del cobro
 * @param {Object} user Objeto de cobro
 * @returns {Promise} Promesa con el objeto de cobro actualizado
 */
async function updateDeudor(id, deudor) {
  try {
    const deudorFound = await Deudor.findById(id);
    if (!deudorFound) return [null, "El deudor no existe"];

    const { nombre, apellido, rut, telefono, email } = deudor;

    const deudorRutFound = await Deudor.findOne({
      rut: deudor.rut,
      _id: { $ne: id },
    });

    if (deudorRutFound) {
      return [null, "El rut ya existe en otro deudor"];
    } else {
      const deudorUpdate = await Deudor.findByIdAndUpdate(
        id,
        {
          nombre,
          apellido,
          rut,
          telefono,
          email,
        },
        { new: true },
      );

      return [deudorUpdate, null];
    }
  } catch (error) {
    handleError(error, "deudor.service -> updateDeudor");
  }
}

module.exports = {
  createDeudor,
  getDeudores,
  deleteDeudor,
  getDeudorById,
  updateDeudor,
};
