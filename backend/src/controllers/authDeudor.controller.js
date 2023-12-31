"use strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const { authDeudorLoginBodySchema } = require("../schema/authDeudor.schema");
const { handleError } = require("../utils/errorHandler");
const AuthDeudorService = require("../services/authDeudor.service");
/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function login(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = authDeudorLoginBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);
    const [accessToken, refreshToken, errorToken] =
      await AuthDeudorService.login(body);

    if (errorToken) return respondError(req, res, 400, errorToken);

    // * Existen mas opciones de seguirdad para las cookies *//
    res.cookie("jwtDeudor", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    respondSuccess(req, res, 200, { accessToken });
  } catch (error) {
    handleError(error, "authDeudor.controller -> login");
    respondError(req, res, 400, error.message);
  }
}
/**
 * @name logout
 * @description Cierra la sesión del usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns
 */
async function logout(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");
    res.clearCookie("jwtDeudor", { httpOnly: true });
    respondSuccess(req, res, 200, { message: "Sesión cerrada correctamente" });
  } catch (error) {
    handleError(error, "authDeudor.controller -> logout");
    respondError(req, res, 400, error.message);
  }
}

/**
 * @name refresh
 * @description Refresca el token de acceso
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function refresh(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");

    const [accessToken, errorToken] = await AuthDeudorService.refresh(cookies);

    if (errorToken) return respondError(req, res, 400, errorToken);

    respondSuccess(req, res, 200, { accessToken });
  } catch (error) {
    handleError(error, "authDeudor.controller -> refresh");
    respondError(req, res, 400, error.message);
  }
}
module.exports = {
  login,
  logout,
  refresh,
};
