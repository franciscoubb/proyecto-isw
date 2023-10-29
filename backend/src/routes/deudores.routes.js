"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlado de cobros */
const misDeudasController = require("../controllers/misDeudas.controller.js");


/** Middleware de autenticación */
const { verifyRUTToken } = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(verifyRUTToken);
// Define las rutas para los ciudadanos deudores
router.post("/", misDeudasController.createPago);
router.get("/", misDeudasController.getMisDeudas);
router.get("/:id", misDeudasController.getMisDeudasByid);

module.exports = router;
