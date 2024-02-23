const express = require('express');
const laporanRouter = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' })
const laporanController = require('../controllers/laporanController')
const { uploadFile } = require('../helpers/helpers')

laporanRouter.get('/get-laporan-dashboard', laporanController.getLaporanDashboard);
laporanRouter.get('/get-laporan-validation', laporanController.getLaporanValidation);
laporanRouter.get('/get-laporan-rejected', laporanController.getLaporanRejected);
laporanRouter.get('/get-trend-laporan', laporanController.getTrendLaporan);
// laporanRouter.post('/upload-laporan', upload.single("file"), laporanController.uploadLaporan);
laporanRouter.post('/upload-laporan', uploadFile().single("file"), laporanController.uploadLaporan);
laporanRouter.put('/update-laporan', laporanController.updateLaporan);
laporanRouter.put('/delete-laporan', laporanController.deleteLaporan);
laporanRouter.put('/approve', laporanController.approveLaporan);
laporanRouter.put('/rejected', laporanController.rejectedLaporan);
laporanRouter.get('/get-approve', laporanController.getApproveByLaporanId);


module.exports = laporanRouter;