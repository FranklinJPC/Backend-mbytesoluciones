import app from "./server.js";
import connection from "./database.js";

connection();
app.listen(app.get('port'), ()=>{
    console.log(`Server Encendido en: ${app.get('port')}`)
})

