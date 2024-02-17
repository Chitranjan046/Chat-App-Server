const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const ws = require('ws');
const http = require('http');
const app = express();


app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const wss = new ws.Server({ server });
const PORT = process.env.PORT || 4040;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
