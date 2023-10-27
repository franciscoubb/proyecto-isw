"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Enrutador de usuarios  */
const userRoutes = require("./user.routes.js");

/** Enrutador de autenticación */
const authRoutes = require("./auth.routes.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

// Exporta el enrutador
module.exports = router;

// Importa los módulos necesarios
const { DebtService, DebtModel } = require("./services/debt.service");
const { sendMail } = require("./utils/sendMail");

// Define la ruta para realizar un pago
router.post("/pagos", authenticationMiddleware, async (req, res) => {
  // Valida el payload
    const { monto, idDeuda } = req.body;
if (!monto || !idDeuda) {
    return res.status(400).json({
    error: "El payload es inválido.",
    });
}

  // Realiza el pago
const { deuda } = await DebtService.pay({
    monto,
    idDeuda,
});

  // Actualiza el estado de la deuda
await DebtModel.update({
    id,
    status: deuda.status,
});

  // Envía el correo electrónico
await sendMail({
    to: req.user.email,
    subject: "Pago realizado",
    text: "El pago de la deuda con ID ${deuda.id} ha sido realizado exitosamente.",
});

  // Devuelve el estado de la deuda
return res.json(deuda);
});

// Define la ruta para ver las deudas del usuario
router.get("/deudas", authenticationMiddleware, async (req, res) => {
  // Obtiene el usuario autenticado
const user = await UserService.findById(req.user.id);

  // Devuelve la lista de deudas
return res.json(user.deudas);
});

// Exporta el enrutador
module.exports = router;