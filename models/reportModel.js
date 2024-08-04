const con = require('../config/config');
let { asynqQuery,getUser,generateNewStatus, generateRejectedStatus,getFile } = require('../helpers/helpers');

class reportModel {
    static getReport(req, res, next) {
        let status_report = req.body.status_report
        let query = `SELECT * FROM ${'`db_laporan`'}.tb_report
                    WHERE status_report = ${status_report}`
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static async uploadReport(req, res, next) {
        let point_role = 0
        let reportData = {
            id_user: req.body.id_user,
            id_laporan: req.body.id_laporan,
            text: req.body.text,
            point_report: point_role
        }

        let user = await getUser(reportData.id_user);
        reportData.point_report = user[0].point_role;

        let query = `INSERT INTO ${'`db_laporan`'}.tb_report SET ?`
        con.query(query, reportData, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static deleteReport(req, res, next) {
        let id_report = req.body.id_report;
        let query = `DELETE FROM ${'`db_laporan`'}.tb_report WHERE id_report = ` + id_report;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }
}

module.exports = reportModel;