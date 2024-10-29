require('dotenv').config();

const express = require('express');
// const bodyParser = require('body-parser');
const router = require('./routes/router');
const cors = require('cors');
const app = express();
const PORT = 3000;
const morgan = require('morgan');
// const http = require('http').createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(router)

app.use((req, res, next) => {
    const error = new Error('Server issues!');
    error.status = 500;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => console.log('Server berjalan di port ' + PORT + "..."));
// http.listen(PORT, () => console.log('Server berjalan di port ' + PORT + "..."));