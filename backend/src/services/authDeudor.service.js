"use strict";

/** Modelo de datos 'User' */
const Deudor = require("../models/deudor.model.js");

/** Modulo 'jsonwebtoken' para crear tokens */
const jwt = require("jsonwebtoken");

const {
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
} = require("../config/configEnv.js");

const { handleError } = require("../utils/errorHandler");

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario
 */
async function login(deudor) {
  try {
    const { rut } = deudor;

    const deudorFound = await Deudor.findOne({ rut: rut });
    if (!deudorFound) {
     return [null, null, "El deudor no existe"];
    }

    const accessToken = jwt.sign(
      { rut: deudorFound.rut },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = jwt.sign(
        { rut: deudorFound.rut },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "7d", // 7 días
      },
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "authDeudor.service -> signIn");
  }
}
/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
async function refresh(cookies) {
    try {
      if (!cookies.jwt) return [null, "No hay autorización"];
      const refreshToken = cookies.jwt;
  
      const accessToken = await jwt.verify(
        refreshToken,
        REFRESH_JWT_SECRET,
        async (err, deudor) => {
          if (err) return [null, "La sesion a caducado, vuelva a iniciar sesion"];
  
          const deudorFound = await Deudor.findOne({
            rut: deudor.rut,
          });
  
          if (!deudorFound) return [null, "No deudor no autorizado"];
  
          const accessToken = jwt.sign(
            { rut: deudorFound.rut },
            ACCESS_JWT_SECRET,
            {
              expiresIn: "1d",
            },
          );
  
          return [accessToken, null];
        },
      );
  
      return accessToken;
    } catch (error) {
      handleError(error, "authDeudor.service -> refresh");
    }
  }
module.exports = {
    login,
    refresh,
};
