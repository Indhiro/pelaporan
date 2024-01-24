require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;
const morgan = require('morgan');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
// app.use(express.json());
app.use(cors());
app.use(router)

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => console.log('Server berjalan di port ' + PORT + "..."));