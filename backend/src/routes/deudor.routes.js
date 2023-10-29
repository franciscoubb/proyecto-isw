"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlado de cobros */
const deudorController = require("../controllers/deudor.controller.js");


/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware.verifyJWT);

// Define las rutas para los cobros
router.post("/", authorizationMiddleware.isEncargado, deudorController.createDeudor);
router.get("/", authorizationMiddleware.isEncargado, deudorController.getDeudores);
router.get("/:id", authorizationMiddleware.isEncargado, deudorController.getDeudorById);
router.put("/:id", authorizationMiddleware.isEncargado, deudorController.updateDeudor);
router.delete("/:id", authorizationMiddleware.isEncargado, deudorController.deleteDeudor);
module.exports = router;
