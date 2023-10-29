"use strict";

/**
 * estructura en HTML para notificar registro de deuda por nodemailer
 */
const nuevaDeuda = (deudor, cobro) => {
    const correo = {
        asunto: "deuda",
        cuerpo: `
        <html>
        <body>
            <p>Estimado(a): ${deudor.nombre} ${deudor.apellido}</p>
            <b>Le notificamos que tienes una nueva deuda pendiente. Acontinuacion los detalles:</b>
            <p><b>tipo tramite:</b> ${cobro.tipoTramite}</p>
            <p><b>Total a pagar:</b> ${cobro.monto}</p>
            <p><b>Fecha de Vencimiento:</b> ${cobro.plazoMaximoPago}</p>
            <p>Por favor, accede a la <a href="http://localhost:5000/api/auth/deudor/login">
            pagina web de la municipalidad.</a>
            para gestionar sus deudas y pagos.</p>
            <p>Atentamente,</p>
            <p>municipalidad depto. cobranzas</p>
        </body>
        </html>`,
    };
    return correo;
};
/**
 * Estructura en HTML para notificar el pago por nodemailer
 */
const nuevoPago = (deudor, nuevoPago) => {
    const correo = {
        asunto: "pago",
        cuerpo: `
        <html>
            <body>
                <p>Estimado(a): ${deudor.nombre} ${deudor.apellido}</p>
                <b>notificamos que se ha registrado el pago de forma exitosa.
                Acontinuación los detalles</b>
                <p><b>Monto:</b> ${nuevoPago.monto}</p>
                <p><b>Tipo:</b> ${nuevoPago.tipo}</p>
                <p>Atentamente,</p>
                <p>municipalidad depto. cobranzas</p>
            </body>
        </html>
        `,
    };
    return correo;
};
module.exports= {
    nuevaDeuda,
    nuevoPago,
};
