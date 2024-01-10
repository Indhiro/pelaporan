const reportModel = require('../models/reportModel');

class reportController {
    static getReport(req, res, next) {
        reportModel.getReport(req, res, next);
    };

    static uploadReport(req, res, next) {
        reportModel.uploadReport(req, res, next);
    };

    static deleteReport(req, res, next) {
        reportModel.deleteReport(req, res, next);
    };
    
}

module.exports = reportController;