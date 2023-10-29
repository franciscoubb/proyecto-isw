"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlado de cobros */
const deudorController = require("../controllers/deudor.controller.js");


/** Middlewares de autorización */
// const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
// const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// router.use(authenticationMiddleware);

// Define las rutas para los cobros
router.post("/", deudorController.createDeudor);
router.get("/", deudorController.getDeudores);
router.get("/:id", deudorController.getDeudorById);
router.put("/:id", deudorController.updateDeudor);
router.delete("/:id", deudorController.deleteDeudor);
module.exports = router;
