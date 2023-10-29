"use strict";

/**
 * estructura en HTML para enviar por nodemailer
 */
const nuevaDeuda = () => {
    const correo = {
        asunto: "deuda",
        cuerpo: `
        <html>
        <body>
            <p>Estimad@</p>
            <b>Te informamos que tienes una nueva deuda.</b>
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

module.exports= {
    nuevaDeuda,
};
