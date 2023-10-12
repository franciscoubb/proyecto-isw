"use Strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const CobroService = require("../services/cobro.service");
const { cobroBodySchema, cobroIdSchema } = require("../schema/cobro.schema");
const { handleError } = require("../utils/errorHandler");
/**
 * Obtiene todos los cobros
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getCobros(req, res) {
    try {
        const [cobros, errorCobros] = await CobroService.getCobros();
        if (errorCobros) return respondError(req, res, 404, errorCobros);

        cobros.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, cobros);
    } catch (error) {
        handleError(error, "cobro.controller -> getCobros");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Crea un nuevo cobro
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createCobro(req, res) {
    try {
        const { body } = req;
        const { error: bodyError } = cobroBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const [nuevoCobro, cobroError] = await CobroService.createCobro(body);
        if (cobroError) return respondError(req, res, 400, useError);
        if (!nuevoCobro) {
            return respondError(req, res, 400, "No se creo el cobro");
        }
        respondSuccess(req, res, 201, nuevoCobro);
    } catch (error) {
        handleError(error, "cobro.controller -> createCobro");
        respondError(req, res, 500, "No se creo el cobro");
    }
}

/**
 * Obtiene un cobro por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getCobroById(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = cobroIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [cobro, errorCobro] = await CobroService.getCobroById(params.id);

        if (errorCobro) return respondError(req, res, 404, errorCobro);
        respondSuccess(req, res, 200, cobro);
    } catch (error) {
        handleError(error, "cobro.controller -> getCobroById");
        respondError(req, res, 500, "No se pudo obtener el usuario");
    }
}

/**
 * Actualiza un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateCobro(req, res) {
    try {
        const { params, body } = req;
        const { error: paramsError } = cobroIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = cobroBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [cobro, cobroError] = await CobroService.updateCobro(params.id, body);

        if (userError) return respondError(req, res, 400, cobroError);
        respondSuccess(req, res, 200, cobro);
    } catch (error) {
        respondInternalError(error, "cobro.controller -> updateCobro");
    }
}

/**
 * Elimina un cobro por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteCobro(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = cobroIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const cobro = await CobroService.deleteCobro(params.id);
        !cobro
        ?respondInternalError(
            req,
            res,
            404,
            "No se encontro el cobro solicitado",
            "Verifique el id ingresado",
        )
        : respondSuccess(req, res, 200, cobro);
    } catch (error) {
        handleError(error, "cobro.controller -> deleteCobro");
        handleError(req, res, 500, "No se pudo eliminar el cobro");
    }
}

module.exports = {
    createCobro,
    getCobros,
    getCobroById,
    updateCobro,
    deleteCobro,
};

