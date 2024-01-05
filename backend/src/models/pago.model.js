"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'pago'
const pagoSchema = new mongoose.Schema(
  {
    monto: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    tipo: {
      type: String,
      enum: ["abono", "pagoTotal"],
      required: true,
    },
    cobroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cobro",
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
    },
  },
  {
    versionKey: false,
  },
);

/** Modelo de datos 'Pago' */
const Pago = mongoose.model("Pago", pagoSchema);

// Exporta el modelo de datos 'Pago'
module.exports = Pago;
