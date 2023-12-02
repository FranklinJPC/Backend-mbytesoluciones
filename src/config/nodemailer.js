import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

// Creación del transporter
const transport = nodemailer.createTransport({
    host: process.env.HOST_NODEMAILER,
    port: process.env.PORT_NODEMAILER,
    auth:{
        user: process.env.USER_NODEMAILER,
        pass: process.env.PASS_NODEMAILER
    }
})

// send mail with defined transport object
const sendMailToUser = async(userMail,token)=>{
    let info = await transport.sendMail({
        from: 'admin@mybytes.com',
        to: userMail,
        subject: "Verifica tu cuenta de correo electrónico",
        html: 
        `
        <h1>Mbytes Soluciones tecnologicas</h1>
        <hr>
        <a href=${process.env.URL_BACKEND}confirmar/${token}>Clic para confirmar tu cuenta</a>
        <hr>
        <footer>Bienvenido!!</footer>
        `
    })
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
    console.log("URL: ", nodemailer.getTestMessageUrl(info));
    console.log("Usuario: ", userMail);
}

export {
    sendMailToUser
}