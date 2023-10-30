/* eslint-disable max-len */
"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de cobros */
const cobroController = require("../controllers/cobro.controller.js");

/** Controlador excel */
const excelController = require("../controllers/excel.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware.verifyJWT);

// Define las rutas para los cobros
router.post("/", authorizationMiddleware.isEncargado, cobroController.createCobro);
router.get("/", authorizationMiddleware.isEncargado, cobroController.getCobros);
router.get("/:id", authorizationMiddleware.isEncargado, cobroController.getCobroById);
router.get("/deudor/:id", authorizationMiddleware.isEncargado, cobroController.getCobrosByDeudorId);
// Rutas para pagos
router.get("/pagos/:id", authorizationMiddleware.isEncargado, cobroController.getPagosByCobroId);
router.put("/:id", authorizationMiddleware.isEncargado, cobroController.updateCobro);
router.delete("/:id", authorizationMiddleware.isEncargado, cobroController.deleteCobro);
router.get("/descargar/excel", authorizationMiddleware.isEncargado, excelController.generarExcel);

module.exports = router;
