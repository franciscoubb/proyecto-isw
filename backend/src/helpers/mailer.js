/* eslint-disable require-jsdoc */
const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASS } = require("../config/configEnv.js");

const enviarMail = async (destinatario, asunto, cuerpo) => {
    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: EMAIL,
            pass: EMAIL_PASS,
        },
    };
    const mensaje ={
        from: `Municipalidad ${EMAIL}`,
        to: destinatario,
        subject: asunto,
        html: cuerpo,
    };
    const transport = nodemailer.createTransport(config);

    await transport.sendMail(mensaje);
};

module.exports = { enviarMail };
