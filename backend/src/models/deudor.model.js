"use Strict";
const mongoose = require("mongoose");

const deudorSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 18,
        },
        apellido: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 20,
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
