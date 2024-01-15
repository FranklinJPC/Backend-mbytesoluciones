import cron from 'node-cron'
import Productos from '../models/Productos.js'
import Usuarios from '../models/Usuarios.js'
import Clientes from '../models/Clientes.js'

cron.schedule('17 0 * * Monday', () => {
  // Código a ejecutar
    console.log('----Ejecutando cron----')
    try {
        // Eliminar usuarios con cuentas que no han sido confirmadas
        Usuarios.find({estado:false, token: {$ne: null}}).then((usuarios)=>{
            usuarios.forEach(async (usuario)=>{
                const {correo, nombre, apellido} = usuario
                await Usuarios.findOneAndDelete({correo})
                await Clientes.findOneAndDelete({correo})
                console.log(`Usuario: ${nombre} ${apellido} ${correo} ----- eliminado por correo no confirmado`)
            })
        })
        // Token ignorado al cambiar de contrasenia
        Usuarios.find({estado:true, token: {$ne: null}}).then((usuarios)=>{
            usuarios.forEach(async (usuario)=>{
                usuario.token = null
                await usuario.save()
                console.log(`Usuario: ${usuario.nombre} ${usuario.apellido} ${usuario.correo} ---- token eliminado por inactividad`)
            })
        })
        console.log(`Cron ejecutado correctamente ${new Date()}`)
    } catch (error) {
        console.log(`Error en la ejecucion del cron: ${error}`)
    }
})

export default cron