"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlado de cobros */
const cobroController = require("../controllers/cobro.controller.js");

/** Controlado excel */
const excelController = require("../controllers/excel.controller.js");

/** Middlewares de autorización */
// const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
// const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// router.use(authenticationMiddleware);

// Define las rutas para los cobros
router.post("/", cobroController.createCobro);
router.get("/", cobroController.getCobros);
router.get("/:id", cobroController.getCobroById);
router.put("/:id", cobroController.updateCobro);
router.delete("/:id", cobroController.deleteCobro);
router.get("/descargar/excel", excelController.generarExcel);


module.exports = router;
