
# API Mbytes Soluciones Tecnologicas

Instrucciones para la instalacion del API de manera local para mejoras o Forks que se deseen realizar como una plantilla.
Antes de comenzar se requeire de los siguientes programas necesarios para su funcionamiento.
* **Git**
* **Visual Studio Code** o cualquier otro editor de codigo compatible con Node.js
* **MongoDB Compass** de manera local o **MongoDB Atlas** Si se desea utilizar su servicio en la nube.
* **Node.js**
* **Postman** o cualquiera otra aplicacion para la prueba de las peticiones de la API

 

## Instalación

Para su funcionamiento de manera adecuada se debe realizar los siguientes pasos:

-  Clonar el respositorio actual con el ultimo commit mediante la opcion HTTPS.
-  Abrir el proyecto mediante un IDE como Visual Studio Code.
- Una vez abierto el proyecto instalar las dependencias mediante el comando:
```
npm i
```
- Una vez instalado todas las dependencias tendriamos que realizar la configuracion de las variables de entorno y la conexion a la base de datos.
    

## Configuraciones

Para realizar las siguientes configuraciones abra que tener cuentas en las siguientes plataformas.
* **Gmail**
* **Cloudinary**
* **MongoDB Atlas** (opcional si se utiliza la version en la nube)

El archivo .envExample contiene los siguientes campos, para poder guiarse:
```
MONGO_URL = ............
HOST_NODEMAILER = ............
PORT_NODEMAILER = ............
USER_NODEMAILER = ............
PASS_NODEMAILER = ............
URL_BACKEND = ............
JWT_SECRET = ............
CLOUD_NAME = ............
API_KEY = ............
API_SECRET = ............
``` 
#### **MongoDB**
Desde un ambiente local se utiliza el siguiente URL: *mongodb://0.0.0.0:27017/nombreBaseDatos*

Desde el ambiente web se debera hacer ciertos pasos extras:
- Ingresar a MongoDB Atlas
- Crear una nueva base de datos, guiarse por el siguiente Link: https://www.freecodecamp.org/espanol/news/tutorial-de-mongodb-atlas-como-empezar/
- Una vez creado connectarse mediante la URL, puede guiarse igualmente por el link anterior o dirigirse directamente a la seccion mediante este: https://www.freecodecamp.org/espanol/news/tutorial-de-mongodb-atlas-como-empezar/#:~:text=Connectarte%20a%20tu%20cluster
- Agregar el link generado con los cambios en la variable de entorno *MONGO_URL*

#### **Nodemailer**
Para utilizr el SMTP de Gmail se debera hacer ciertos cambios en la cuenta de Gmail.
- Se debe agregar la autenticacion de dos factores a la cuenta.
- Se debe agregar una contraseña de aplicacion con un nombre.
Las variables de entorno se basan en el siguiente link: https://kinsta.com/es/blog/gmail-smtp-servidor/#:~:text=de%20forma%20gratuita-,C%C3%B3mo%20Puedes%20Encontrar%20el%20Servidor%20SMTP%20para%20Gmail,-Empecemos%20con%20la

* HOST_NODEMAILER: para gmail se suele utilizar *smtp.gmail.com*
* PORT_NODEMAILER: Se utiliza el puerto *465*
* USER_NODEMAILER: El correo electronico de Gmail.
* PASS_NODEMAILER: La contraseña de la aplicacion generada anteriormente.

### **URL_BACKEND**
Se trata del dominio para el funcionamiento con el Frontend, sin embargo para la utilizacion exclusivamente de la API no sera necesario, unicamente se debera colocar el *localhost:puerto* hacer el siguiente cambio en el codigo:
- En el modulo config y Cloudinary cambiar el codigo:
```html 
<a href="https://mbytesoluciones.com/nuevoPassword.php?token=${token}">Clic para reestablecer tu contraseña</a>
``` 
Por lo siguiente:
```html
<a href="${process.env.URL_BACKEND}/recuperar-password/${token}">Clic para reestablecer tu contraseña</a>
```

De igual manera el cambio se debera realizar en:
```html
<a href="https://mbytesoluciones.com/confirmarEmail.php?token=${token}">Clic para confirmar tu cuenta</a>
```
Por lo siguiente:
```html
<a href="${process.env.URL_BACKEND}/confirmar/${token}">Clic para confirmar tu cuenta</a>
```
Esto permitira el correcto funcionamiento de la API sin necesidad de la configuracion realizada con el Frontend.

#### **Key Secret JWT**

Se trata de la clave secreta para el funcionamiento de los algoritmos JWT. Su documentacion completa se puede encontrar aqui: https://www.npmjs.com/package/jsonwebtoken#:~:text=the%20JsonWebToken%20string-,secretOrPublicKey,-is%20a%20string

Para genera la clave de manera rapida se puede utilizar el siguiente comando en el terminal de windows y agregarlo a *JWT_SECRET*.
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
#### **Cloudinary**

Una vez creada la cuenta simplemente dirigirse a *Dashboard* y colocar las credenciales que se visualizan en los mismo campos.
- CLOUD_NAME
- API_KEY
- API_SECRET

## Uso

Una vez realizado todas las configuraciones correspondientes utilizar el comando.
``` 
npm run dev
```
Para poner en funcionamiento el servidor y la API.

#### **Postman**
Para su interactuar con cada uno de los endpoints correspondientes utilizar la herramienta Postman mediante el siguiente enlace.
