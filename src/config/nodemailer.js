import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

// Creación del transporter
const transport = nodemailer.createTransport({
    host: process.env.HOST_NODEMAILER,
    port: process.env.PORT_NODEMAILER,
    auth: {
        user: process.env.USER_NODEMAILER,
        pass: process.env.PASS_NODEMAILER
    }
})

// send mail with defined transport object
const sendMailToUser = async(userMail,token)=>{
    let info = await transport.sendMail({
        from: 'MbyteSolucionesTecnologicas@outlook.com',
        to: userMail,
        subject: "Verificacion de cuenta nueva",
        html: 
        `
        <h1>Mbytes Soluciones tecnologicas</h1>
        <hr>
        <a href="https://mbytesoluciones.com/nuevo/confirmarEmail.php?token=${token}">Clic para confirmar tu cuenta</a>
        <hr>
        <footer>Bienvenido!!</footer>
        `
    })
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
    console.log("URL: ", nodemailer.getTestMessageUrl(info));
    console.log("Usuario: ", userMail);
}

// send mail with defined transport object
const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'MbyteSolucionesTecnologicas@outlook.com',
    to: userMail,
    subject: "Reestablecer tu contraseña",
    html: `
    <h1>Mbytes Soluciones tecnologicas</h1>
    <hr>
    <a href="https://mbytesoluciones.com/nuevo/nuevoPassword.php?token=${token}">Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Soluciones y productos</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
const sendMailNotifyOrder = async(userMail, Pedido)=>{
    let info = await transport.sendMail({
        from: 'MbyteSolucionesTecnologicas@outlook.com',
        to: userMail,
        subject: "Notificacion de Orden",
        html: `
        <h1>Mbytes Soluciones tecnologicas</h1>
        <hr>
        <h2>Orden de compra</h2>
        <hr>
        <p>
            Su pedido de compra ha sido <b>${Pedido}</b> <br>
            Gracias por su compra 
        </p>
        <p>
            Revise sus pedidos de compra en el siguiente enlace <br>
            <a href="https://mbytesoluciones.com/nuevo/cliente/compras.php">PEDIDOS 🛒</a>
        </p>
        <p>
            <b>Nota: </b> No responder a este correo
        </p>
        <hr>
        <footer>Soluciones y productos</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailNotifyOrder
}