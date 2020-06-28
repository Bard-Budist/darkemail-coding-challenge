//importo dependencias
const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
var cors = require('cors')

//load ENV variable in the .env file
dotenv.config();

//import routes for the endepoint status and send email
const status = require("./routes/status.js");
const send = require("./routes/send.js")
const user = require("./routes/user.js")
//api express instance
const api = express();

//api config
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(cors())

//use routes for the endpoints
api.use("/status", status);
api.use("/send", send);
api.use("/user", user)

//Run server
api.listen(process.env.PORT, function () {
    console.log("API up");
})
