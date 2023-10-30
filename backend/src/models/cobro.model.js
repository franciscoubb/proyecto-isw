"use strict";

const mongoose = require("mongoose");
const TRAMITES = require("../constants/tramites.constants.js");
const moment = require("moment");
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
/* eslint-disable no-invalid-this */
cobroSchema.pre("save", function(next) {
    // Moment.js para formatear la fecha de emisión como DD-MM-YYYY
    this.fechaEmision = moment(this.fechaEmision).format("DD-MM-YYYY");
    next();
});
/* eslint-enable no-invalid-this */


const Cobro = mongoose.model("Cobro", cobroSchema);

module.exports = Cobro;
