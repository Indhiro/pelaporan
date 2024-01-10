const laporanModel = require('../models/laporanModel');

class laporanController {
    static getLaporan(req, res, next) {
        laporanModel.getLaporan(req, res, next);
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

}

module.exports = laporanController;