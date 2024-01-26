const express = require('express');
const laporanRouter = express.Router();
const laporanController = require('../controllers/laporanController')

laporanRouter.get('/get-laporan-dashboard', laporanController.getLaporanDashboard);
laporanRouter.get('/get-laporan-validation', laporanController.getLaporanValidation);
laporanRouter.get('/get-laporan-rejected', laporanController.getLaporanRejected);
laporanRouter.get('/get-trend-laporan', laporanController.getTrendLaporan);
laporanRouter.post('/upload-laporan', laporanController.uploadLaporan);
laporanRouter.put('/update-laporan', laporanController.updateLaporan);
laporanRouter.put('/delete-laporan', laporanController.deleteLaporan);
laporanRouter.put('/approve', laporanController.approveLaporan);
laporanRouter.put('/rejected', laporanController.rejectedLaporan);

module.exports = laporanRouter;