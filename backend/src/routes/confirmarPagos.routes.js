/* eslint-disable max-len */
"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de cobros */
const confirmacionPago = require("../controllers/confirmacionPago.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware.verifyJWT);

// Define las rutas para la confirmacion de pagos
// Ruta para aceptar un pago por su id
router.post(
  "/:id",
  authorizationMiddleware.isEncargado,
  confirmacionPago.confirmarPago,
);
// Ruta para obtener todos los pagos pendientes
router.get(
  "/",
  authorizationMiddleware.isEncargado,
  confirmacionPago.getPagosNoConfirmados,
);

module.exports = router;
