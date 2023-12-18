"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Enrutador de usuarios  */
const userRoutes = require("./user.routes.js");

/** Enrutador de autenticación */
const authRoutes = require("./auth.routes.js");

/** Enrutador de cobros  */
const cobroRoutes = require("./cobro.routes.js");

/** Enrutador de datos de deudor */
const deudorRoutes = require("./deudor.routes.js");

/** Enrutador para los deudores */
const deudoresRoutes = require("./deudores.routes.js");

/** Enrutador de autenticación de deudores */
const authDeudorRoutes = require("./authDeudor.routes.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware.verifyJWT, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);
// Define las rutas para la autenticacion de deudores /api/authDeudor
router.use("/auth/deudor", authDeudorRoutes);
// Define las rutas para datos de deudor api/deudor
router.use("/deudor", authenticationMiddleware.verifyJWT, deudorRoutes);
// Define las rutas para cobro /api/cobro
router.use("/cobro", authenticationMiddleware.verifyJWT, cobroRoutes);
// Define las rutas para los api/deudores
router.use("/deudores", deudoresRoutes);
// Exporta el enrutador
module.exports = router;
