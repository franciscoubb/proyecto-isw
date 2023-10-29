"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlado de cobros */
const authDeudorController = require("../controllers/authDeudor.controller");

/** Instancia del enrutador */
const router = express.Router();


// Define las rutas para autenticacion de deudor
router.post("/login", authDeudorController.login);


module.exports = router;
