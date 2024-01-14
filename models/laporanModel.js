const con = require('../config/config');
let dbName = 'db_laporan'

class laporanModel {
    // static getLaporan(req, res, next) {
    //     let query = `SELECT * FROM ${dbName}.tb_laporan`;
    //     con.query(query, function(err, result, fields) {
    //         if (err) throw err;
    //         res.send(result);
    //     });
    // }

    static getLaporan(req, res, next) {
        let id_laporan = req.body.id_laporan
        // let query = `SELECT tl.*, tld. FROM ${dbName}.tb_laporan tl
        // LEFT JOIN ${dbName}.tb_like_dislike tld on tl.id_laporan = tld.id_laporan`;
        let query = `SELECT tl.*, tlds.countLike
        FROM ${dbName}.tb_laporan tl
        left join (SELECT COUNT(tld.id_like_dislike) as countLike, tld.id_laporan
            FROM ${dbName}.tb_like_dislike tld
            WHERE tld.status_like_dislike = 'like' group by tld.id_laporan) tlds 
        on tl.id_laporan = tlds.id_laporan`
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static getTrendLaporan(req, res, next) {
        let queryTbLaporan = `SELECT * FROM ${dbName}.tb_laporan`
        let queryTbLikeDislike = `SELECT point_like_dislike FROM ${dbName}.tb_like_dislike`
        let queryTbComment = `SELECT point_comment FROM ${dbName}.tb_comment`
        let queryTbReport = `SELECT point_report FROM ${dbName}.tb_report`
        con.query(queryTbLaporan, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
       
    }

    static uploadLaporan(req, res, next) {
        // console.log(req);
        let laporanData = {
            id_user_pelapor: req.body.id_user_pelapor,
            id_user_penerima: req.body.id_user_penerima,
            status_laporan: req.body.status_laporan,
            category: req.body.category,
            title: req.body.title,
            text: req.body.text,
            lokasi_longitude: req.body.lokasi_longitude,
            lokasi_latitude: req.body.lokasi_latitude,
            image: req.body.image
        }
        return console.log(req.body);
        let query = `INSERT INTO ${dbName}.tb_laporan SET ?`;
        con.query(query, laporanData, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static updateLaporan(req, res, next) {
        let { id_laporan, category, title, text, lokasi_longitude, lokasi_latitude, image } = req.body;
        let updated_at = `CURRENT_TIMESTAMP`;
        
        let query = `UPDATE ${dbName}.tb_laporan SET `;

        if(category) query += ` category = '${category}',`;
        if(title) query += ` title = '${title}',`;
        if(text) query += ` text = '${text}',`;
        if(lokasi_longitude) query += ` lokasi_longitude = '${lokasi_longitude}',`;
        if(lokasi_latitude) query += ` lokasi_latitude = '${lokasi_latitude}',`;
        if(image) query += ` image = '${image}',`;
        query += `updated_at = ${updated_at},`;

        query = query.slice(0, -1);
        query += ` WHERE id_laporan = ${id_laporan} AND deleted_at IS NULL`

        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });

    }

    static deleteLaporan(req, res, next) {
        let id_laporan = req.body.id_laporan
        let deleted_at = `CURRENT_TIMESTAMP`;

        let query = `UPDATE ${dbName}.tb_laporan SET `;
        query += ` deleted_at = ${deleted_at},`

        query = query.slice(0, -1);
        query += ` WHERE id_laporan = ${id_laporan} AND deleted_at IS NULL`

        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });

    };
}

module.exports = laporanModel;