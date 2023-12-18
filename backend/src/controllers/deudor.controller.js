"use Strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const DeudorService = require("../services/deudor.sevice");
const { deudorBodySchema, deudorIdSchema } = require("../schema/deudor.schema");
const { handleError } = require("../utils/errorHandler");
/**
 * Crea un nuevo deudor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createDeudor(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = deudorBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);
    const [nuevoDeudor, deudorError] = await DeudorService.createDeudor(body);
    if (deudorError) return respondError(req, res, 400, deudorError);
    if (!nuevoDeudor) {
      return respondError(req, res, 400, "No se creo el deudor");
    }
    respondSuccess(req, res, 201, nuevoDeudor);
  } catch (error) {
    handleError(error, "deudor.controller -> createDeudor");
    respondError(req, res, 500, "No se creo el deudor");
  }
}

/**
 * Crea un nuevo deudor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getDeudores(req, res) {
  try {
    const [deudores, errorDeudores] = await DeudorService.getDeudores();
    if (errorDeudores) return respondError(req, res, 404, errorDeudores);

    deudores.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, deudores);
  } catch (error) {
    handleError(error, "deudor.controller -> getDeudores");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Elimina un cobro por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteDeudor(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = deudorIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const deudor = await DeudorService.deleteDeudor(params.id);
    if (!deudor) {
      respondError(
        req,
        res,
        404,
        "No se encontro el deudor solicitado",
        "Verifique el id ingresado",
      );
    } else if (deudor[1]) {
      respondError(req, res, 409, deudor[1]);
    } else {
      respondSuccess(req, res, 200, deudor);
    }
  } catch (error) {
    handleError(error, "deudor.controller -> deleteDeudor");
    handleError(req, res, 500, "No se pudo eliminar el deudor");
  }
}
/**
 * Obtiene un deudor por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getDeudorById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = deudorIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [cobro, errorDeudor] = await DeudorService.getDeudorById(params.id);

    if (errorDeudor) return respondError(req, res, 404, errorDeudor);
    respondSuccess(req, res, 200, cobro);
  } catch (error) {
    handleError(error, "deudor.controller -> getCobroById");
    respondError(req, res, 500, "No se pudo obtener el deudor");
  }
}
/**
 * Actualiza un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateDeudor(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = deudorIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = deudorBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [deudor, deudorError] = await DeudorService.updateDeudor(
      params.id,
      body,
    );

    if (deudorError) return respondError(req, res, 400, deudorError);
    respondSuccess(req, res, 200, deudor);
  } catch (error) {
    handleError(error, "user.controller -> updateUser");
    respondError(req, res, 500, "No se pudo actualizar el usuario");
  }
}
module.exports = {
  createDeudor,
  getDeudores,
  deleteDeudor,
  getDeudorById,
  updateDeudor,
};
