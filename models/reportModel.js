const con = require('../config/config');
let { asynqQuery,getUser,responseFormated,getFile } = require('../helpers/helpers');
const { DATABASE } = require('../config/db');

class reportModel {
    static getReport(req, res, next) {
        let status_report = req.body.status_report
        let query = `SELECT * FROM ${DATABASE}.tb_report
                    WHERE status_report = ${status_report}`
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static async getLaporanReport(req, res, next) {
        try {
            let result = [];
            let query = `SELECT tl.* , tr.*, tu.nama, tu.role as role_pelapor,tuun.nama_penerima, tuun.role, tur.nama as user_report, 
            DATE_FORMAT(tr.created_at, "%d-%m-%Y") as dateformated 
            FROM ${DATABASE}.tb_laporan tl
                INNER JOIN ${DATABASE}.tb_report tr ON tl.id_laporan = tr.id_laporan
                left join ${DATABASE}.tb_user tu
                on tl.id_user_pelapor = tu.id_user
                left join (select tuu.nama as nama_penerima, tuu.id_user, tuu.role
                from ${DATABASE}.tb_user tuu) tuun on tl.id_user_penerima = tuun.id_user
                left join (select tuur.nama , tuur.id_user
            from ${DATABASE}.tb_user tuur) tur on tr.id_user = tur.id_user`
            let lap = await asynqQuery(query);

            for (let index = 0; index < lap.length; index++) {
                const element = lap[index];
                if (!result.find(e => e.id_laporan == element.id_laporan)) {
                    let findSame = lap.filter(el => el.id_laporan == element.id_laporan);
                    element.reportData = []
                    for (let indexx = 0; indexx < findSame.length; indexx++) {
                        const el = findSame[indexx];
                        element.reportData.push({
                            text: el.text,
                            point_report: el.point_report,
                            user_report: el.user_report,
                            dateformated: el.dateformated
                        })
                    }   
                    if (element.image) element.image = await getFile(next, element.image)
                    result.push(element)
                }
            }

            res.send(responseFormated(true, 200, 'Success', result));
        } catch (error) {
            console.log('getLaporanReport', error);
        }
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

        let query = `INSERT INTO ${DATABASE}.tb_report SET ?`
        con.query(query, reportData, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static deleteReport(req, res, next) {
        let id_report = req.body.id_report;
        let query = `DELETE FROM ${DATABASE}.tb_report WHERE id_report = ` + id_report;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }
}

module.exports = reportModel;