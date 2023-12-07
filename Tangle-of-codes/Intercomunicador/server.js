
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const { connect } = require('http2');
const { Socket } = require('dgram');
app.use(express.static(__dirname))