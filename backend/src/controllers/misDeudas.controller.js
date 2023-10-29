"use strict";
// const DeudorService = require("../services/deudor.sevice");
// const { deudorBodySchema } = require("../schema/deudor.schema");
const PDF = require("pdfkit-construct");

/**
 * Crea un nuevo deudor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getMisDeudas(req, res) {
   try {
    const rutDeudor = req.rut;
    return res.json({
        data: rutDeudor,
    });
   } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error al obtener las deudas del deudor." });
   }
}
/**
 * Elimina un cobro por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getComprobantePago(req, res) {
    const doc = new PDF({ bufferPage: true });

    const filename = `Comprobante${Date.now()}.pdf`;

    const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-disposition": `attachment;filename=${filename}`,
    });
    doc.on("data", (data) => {
    stream.write(data);
    });
    doc.on("end", () => {
        stream.end();
    });

    const platos = [
        {
            nro: 1,
            descripcion: "charque",
            precio: 2000,
            cantidad: 3,
            subtotal: 34,
        },
        {
            nro: 1,
            descripcion: "lentejas",
            precio: 1000,
            cantidad: 2,
            subtotal: 76,
        },
    ];
    doc.setDocumentHeader({}, () => {
        doc.text("Comprobante de pago", {
            width: 420,
            align: "center",
        });
    });
    doc.addTable([
        { key: "nro", label: "Nro", align: "left" },
        { key: "descripcion", label: "descripcion", align: "left" },
        { key: "precio", label: "precio unit", align: "left" },
        { key: "cantidad", label: "cantidad", align: "left" },
        { key: "subtotal", label: "sub total", align: "right" },
    ], platos, {
        border: null,
        width: "fill_body",
        striped: true,
        stripedColors: ["#f6f6f6", "#d6c4dd"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: "center",
    });
    doc.render();
    doc.end();
}
module.exports = {
    getMisDeudas,
    getComprobantePago,
};
