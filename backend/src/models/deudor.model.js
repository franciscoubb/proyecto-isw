"use Strict";
const mongoose = require("mongoose");

const deudorSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        apellido: {
            type: String,
            required: true,
        },
        rut: {
            type: String,
            required: true,
            unique: true,
        },
        telefono: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

const Deudor = mongoose.model("Deudor", deudorSchema);

module.exports = Deudor;
