const express = require('express');
const reportRouter = express.Router();
const reportController = require('../controllers/reportController');

//Apakah harus buat 2 get bedanya di status atau ambil input dr front end statusnya
reportRouter.get('/get-report', reportController.getReport);
reportRouter.get('/get-laporan-report', reportController.getLaporanReport);
reportRouter.post('/upload-report', reportController.uploadReport);
reportRouter.delete('/delete-report', reportController.deleteReport);

module.exports = reportRouter;

