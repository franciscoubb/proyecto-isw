"use strict";
// Autorizacion - Comprobar el rol del usuario
const User = require("../models/user.model.js");
// const Deudor = require("../models/deudor.model.js");
const Role = require("../models/role.model.js");
const { respondError } = require("../utils/resHandler.js");
const { handleError } = require("../utils/errorHandler.js");

/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAdmin(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de administrador para realizar esta acción",
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isAdmin");
  }
}
/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isEncargado(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "encargado") {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de encargado para realizar esta acción",
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isEncargado");
  }
}

// /**
//  * Comprueba si el usuario es deudor
//  * @param {Object} req - Objeto de petición
//  * @param {Object} res - Objeto de respuesta
//  * @param {Function} next - Función para continuar con la siguiente función
//  */
// async function isDeudor(req, res, next) {
//   try {
//     const user = await User.findOne({ email: req.email });
//     const roles = await Role.find({ _id: { $in: user.roles } });
//     for (let i = 0; i < roles.length; i++) {
//       if (roles[i].name === "deudor") {
//         next();
//         return;
//       }
//     }
//     return respondError(
//       req,
//       res,
//       401,
//       "Se requiere un rol de encargado para realizar esta acción",
//     );
//   } catch (error) {
//     handleError(error, "authorization.middleware -> isEncargado");
//   }
// }
// /**
//  * Comprueba si el usuario es deudor
//  * @param {Object} req - Objeto de petición
//  * @param {Object} res - Objeto de respuesta
//  * @param {Function} next - Función para continuar con la siguiente función
//  */
// async function isDeudor(req, res, next) {
//   try {
//     const deudor = await Deudor.findOne({ rut: req.rut }); // Busca el usuario por RUT
//     if (deudor) {
//       next();
//       return;
//     } else {
//       return respondError(req, res, 401, "No autorizado El RUT no coincide con un usuario deudor.");
//     }
//   } catch (error) {
//     handleError(error, "authorization.middleware -> isDeudor");
//   }
// }

module.exports = {
  isAdmin,
  isEncargado,
};
