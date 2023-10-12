const xl = require("excel4node");
const path = require("path");
const fs = require("fs");
const { getCobros } = require("../services/cobro.service");
const { respondError, respondSuccess } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");

const date = new Date();
const fechaDia = date.getUTCDate();
const fechaMes = (date.getUTCMonth()) + 1;
const fechaAnio = date.getUTCFullYear();

/**
 * Obtiene todos los cobros y genera un excel
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function generarExcel(req, res) {
    try {
        const wb = new xl.Workbook();
        const nombreArchivo = "cobros"+ fechaDia + "_" + fechaMes + "_" + fechaAnio;
        const [cobros, errorCobros] = await getCobros();
        if (errorCobros) return respondError(req, res, 404, errorCobros);
        if (cobros.length === 0) respondSuccess(req, res, 204);
        const ws = wb.addWorksheet(nombreArchivo);

        const columnaStyle = wb.createStyle({
            font: {
                name: "Arial",
                color: "#000000",
                size: 12,
                bold: true,
            },
        });

        const contenidoEstilo = wb.createStyle({
            font: {
                name: "Arial",
                color: "#494949",
                size: 11,
            },
        });

        ws.cell(1, 1).string("Nombre").style(columnaStyle);
        ws.cell(1, 2).string("Tipo").style(columnaStyle);
        ws.cell(1, 3).string("Monto").style(columnaStyle);
        ws.cell(1, 4).string("Expira").style(columnaStyle);
        ws.cell(1, 5).string("Estado").style(columnaStyle);

        let fila = 2;
        cobros.forEach((cobro) => {
            ws.cell(fila, 1).string(cobro.userId.username).style(contenidoEstilo);
            ws.cell(fila, 2).string(cobro.tipoTramite).style(contenidoEstilo);
            ws.cell(fila, 3).number(cobro.monto).style(contenidoEstilo);
            ws.cell(fila, 4).string(cobro.plazoMaximoPago).style(contenidoEstilo);
            ws.cell(fila, 5).string(cobro.estado.toString()).style(contenidoEstilo);
            fila ++;
        });
        const pathExcel = path.join(__dirname, "../../excel", nombreArchivo + ".xlsx");

        wb.write(pathExcel, function(error) {
            if (error) {
                handleError(error, "excel.controller -> wb.write");
                respondError(req, res, 400, error.message);
            } else {
                /**
                 * Envia el archivo descargado al cliente
                 * @returns {Promise} Promesa con el objeto de los cobros
                 */
                function downloadFile() {
                    res.download(pathExcel);
                }
                downloadFile();

                fs.rm(pathExcel, function(error) {
                    if (error) {
                        handleError(error, "excel.controller -> fs.rm");
                        respondError(req, res, 400, error.message);
                    }
                });
            }
        });
    } catch (error) {
        handleError(error, "excel.controller -> generarExcel");
        respondError(req, res, 500, "No se creo el Excel");
    }
}

module.exports = { generarExcel };
