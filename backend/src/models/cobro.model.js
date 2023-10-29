"use strict";

const mongoose = require("mongoose");
const TRAMITES = require("../constants/tramites.constants.js");

const cobroSchema = new mongoose.Schema(
    {
        tipoTramite: {
            type: String,
            enum: TRAMITES,
            required: true,
        },
        monto: {
            type: Number,
            required: true,
        },
        plazoMaximoPago: {
            type: Date,
            required: true,
        },
        estado: {
            type: String,
            enum: ["pendiente", "vencida", "pagada"],
            default: "pendiente",
        },
        fechaEmision: {
            type: Date,
            default: Date.now(),
        },
        montoPagado: {
            type: Number,
            default: 0,
        },
        deudorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deudor",
        },
    },
    {
        versionKey: false,
    },
);

const Cobro = mongoose.model("Cobro", cobroSchema);

module.exports = Cobro;
