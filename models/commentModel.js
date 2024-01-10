const con = require('../config/config');

class commentModel {
    static getComment(req, res, next) {
        let id_laporan = req.body.id_laporan
        let query = `SELECT * FROM ${'`db_laporan`'}.tb_comment 
                    WHERE id_laporan = ${id_laporan}`
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static uploadComment(req, res, next) {
        let commentData = {
            id_user: req.body.id_user,
            id_laporan: req.body.id_laporan,
            text: req.body.text,
            point_comment: req.body.point_comment
        }

        let query = `INSERT INTO ${'`db_laporan`'}.tb_comment SET ?`
        con.query(query, commentData, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static updateComment(req, res, next) {
        let { id_comment, text } = req.body;
        let updated_at = `CURRENT_TIMESTAMP`;
        
        let query = `UPDATE ${'`db_laporan`'}.tb_comment SET `;
       
        if(text) query += ` text = '${text}',`;
        query += `updated_at = ${updated_at},`;

        query = query.slice(0, -1);
        query += ` WHERE id_comment = ${id_comment}`

        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static deleteComment(req, res, next) {
        let id_comment = req.body.id_comment;
        let query = `DELETE FROM ${'`db_laporan`'}.tb_comment WHERE id_comment = ` + id_comment;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }
}

module.exports = commentModel;