const express = require('express');
const sweetsRouter = require('./routes/sweets');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(cors(
    {
     origin : process.env.CORS_ORIGIN
    }
));

app.use(express.json());
app.use('/api/sweets', sweetsRouter);

module.exports = app;
