const laporanModel = require('../models/laporanModel');

class laporanController {
    static getLaporanDashboard(req, res, next) {
        laporanModel.getLaporanDashboard(req, res, next);
    };

    static getLaporanValidation(req, res, next) {
        laporanModel.getLaporanValidation(req, res, next);
    };
    static getLaporanRejected(req, res, next) {
        laporanModel.getLaporanRejected(req, res, next);
    };

    static getTrendLaporan(req, res, next) {
        laporanModel.getTrendLaporan(req, res, next);
    };

    static uploadLaporan(req, res, next) {
        laporanModel.uploadLaporan(req, res, next);
    };

    static updateLaporan(req, res, next) {
        laporanModel.updateLaporan(req, res, next);
    };

    static deleteLaporan(req, res, next) {
        laporanModel.deleteLaporan(req, res, next);
    };
    
    static approveLaporan(req, res, next) {
        laporanModel.approveLaporan(req, res, next);
    };

    static rejectedLaporan(req, res, next) {
        laporanModel.rejectedLaporan(req, res, next);
    };

    static getApproveByLaporanId(req, res, next) {
        laporanModel.getApproveByLaporanId(req, res, next);
    };

    
}

module.exports = laporanController;