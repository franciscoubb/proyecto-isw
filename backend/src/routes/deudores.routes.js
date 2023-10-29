"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlado de cobros */
const misDeudasController = require("../controllers/misDeudas.controller.js");


/** Middlewares de autorización */
// const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const { verifyRUTToken } = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(verifyRUTToken);
// Define las rutas para los deudores
// router.post("/", deudorController.createDeudor);
router.get("/", misDeudasController.getMisDeudas);
// router.get("/:id", deudorController);
// router.put("/:id", deudorController);
// router.delete("/:id", deudorController);

// router.get("/pago/comprobante", misDeudasController.getComprobantePago);

module.exports = router;
