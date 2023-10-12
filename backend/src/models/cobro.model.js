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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        versionKey: false,
    },
);

const Cobro = mongoose.model("Cobro", cobroSchema);

module.exports = Cobro;
