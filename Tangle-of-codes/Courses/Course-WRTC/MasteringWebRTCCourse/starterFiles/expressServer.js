//Require the installation ===> npn init -y   ===>  npm install express
// we need this to run in a localhost contex instead of file
//so that we can run enumerate devices (it must be run in a secure context)
//and localhost counts
const path = require('path');
const express = require('express');
const { Console } = require('console');
const app = express();
app.use(express.static(path.join(__dirname)))
app.listen(3000)

console.log("The server is running on port 3000")

//then ===> node expressServer.js