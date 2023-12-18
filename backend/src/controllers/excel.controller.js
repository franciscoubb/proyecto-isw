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
        if (errorCobros) {
            return respondError(req, res, 404, errorCobros);
        }
        if (cobros.length === 0) {
            return respondSuccess(req, res, 200, {
                message: "No se encontraron cobros.",
            });
        }

        const totalMontosPagados = cobros.reduce((total, cobro) => {
            if (cobro.estado === "pagada") {
                total += cobro.monto;
            }
            return total;
        }, 0);

        const totalMontosPendientes = cobros.reduce((total, cobro) => {
            if (cobro.estado === "pendiente") {
            total += cobro.monto;
            }
            return total;
        }, 0);
        const ws = wb.addWorksheet(nombreArchivo);

        const columnaStyle = wb.createStyle({
            font: {
                bold: true,
                color: "#008000",
                size: 14,
            },
        });

        const contenidoEstilo = wb.createStyle({
            font: {
                color: "#494949",
                size: 12,
            },
            alignment: {
                horizontal: "left",
            },
        });
        ws.cell(2, 2).string("Rut").style(columnaStyle);
        ws.cell(2, 3).string("Nombre").style(columnaStyle);
        ws.cell(2, 4).string("Tipo").style(columnaStyle);
        ws.cell(2, 5).string("Monto").style(columnaStyle);
        ws.cell(2, 6).string("Vencimiento").style(columnaStyle);
        ws.cell(2, 7).string("Estado").style(columnaStyle);

        ws.column(2).setWidth(23);
        ws.column(3).setWidth(18);
        ws.column(4).setWidth(18);
        ws.column(5).setWidth(18);
        ws.column(6).setWidth(18);

        let fila = 3;
        cobros.forEach((cobro) => {
            ws.cell(fila, 2).string(cobro.deudorId.rut).style(contenidoEstilo);
            ws.cell(fila, 3).string(cobro.deudorId.nombre).style(contenidoEstilo);
            ws.cell(fila, 4).string(cobro.tipoTramite).style(contenidoEstilo);
            ws.cell(fila, 5).number(cobro.monto).style(contenidoEstilo);
            ws.cell(fila, 6).date(cobro.plazoMaximoPago).style({
                numberFormat: "DD-MM-YYYY", // Formato personalizado para fecha
                alignment: {
                  horizontal: "center", // Alinea el texto al centro
                },
                ...contenidoEstilo, // También aplica el estilo de contenido
            });
            // Aplica estilo de fuente en función del estado
    if (cobro.estado === "vencida") {
        ws.cell(fila, 7).string(cobro.estado.toString()).style({
            font: { color: "FF0000" }, // Rojo
        });
    } else if (cobro.estado === "pagada") {
        ws.cell(fila, 7).string(cobro.estado.toString()).style({
            font: { color: "#8DB600" }, // Verde
        });
    } else if (cobro.estado === "pendiente") {
        ws.cell(fila, 7).string(cobro.estado.toString()).style({
            font: { color: "0000FF" }, // Azul
        });
    } else {
        // Estilo por defecto si no coincide con ninguna de las condiciones anteriores
        ws.cell(fila, 7).string(cobro.estado.toString()).style(contenidoEstilo);
    }
            fila ++;
        });
        ws.cell(fila + 1, 2) // Ajusta la fila según tu estructura
            .string("Total Deudas Pendientes:")
            .style({
            font: {
                bold: true,
                color: "#000000", // Color de fuente negro
            },
            });

          ws.cell(fila + 1, 3) // Ajusta la columna según tu estructura
            .number(totalMontosPendientes)
            .style({
            font: { bold: true },
            });
            ws.cell(fila + 2, 2) // Ajusta la fila según tu estructura
            .string("Total Deudas Pagadas:")
            .style({
            font: {
                bold: true,
                color: "#000000", // Color de fuente negro
            },
            });

          ws.cell(fila + 2, 3) // Ajusta la columna según tu estructura
            .number(totalMontosPagados)
            .style({
            font: { bold: true },
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
        respondError(req, res, 400, error.message);
    }
}

module.exports = { generarExcel };
