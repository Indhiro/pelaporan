const con = require('../config/config');
let dbName = 'db_laporan';
let { asynqQuery,getUser,generateNotifNotes } = require('../helpers/helpers');

class commentModel {
    static async getComment(req, res, next) {
        try {
            let id_laporan = req.query.LapId;
            let query = `SELECT tc.*, tu.nama, tu.role
                        FROM ${'`db_laporan`'}.tb_comment tc
                        LEFT JOIN ${'`db_laporan`'}.tb_user tu
                            ON tc.id_user = tu.id_user
                        WHERE tc.id_laporan = ${+id_laporan}`
            let result = await asynqQuery(query)
            res.send(result);
        } catch (error) {
           console.log(error);
           res.send(error.message) 
        }
    }

    static async uploadComment(req, res, next) {
        let point_role = 0
        let commentData = {
            id_user: req.body.id_user,
            id_laporan: req.body.id_laporan,
            text: req.body.text,
            point_comment: point_role
        }
        let qGetLap = `select * from ${dbName}.tb_laporan tl where tl.id_laporan = ${+commentData.id_laporan}`;
        let getLaporan = await asynqQuery(qGetLap)
        let laporan = getLaporan[0];
        let user = await getUser(commentData.id_user);
        commentData.point_comment = user[0].point_role;

        let query = `INSERT INTO ${dbName}.tb_comment SET ?`
        con.query(query, commentData,async function(err, result, fields) {
            if (err) throw err;
            await generateNotifNotes('comment', laporan.id_user_pelapor, user[0].nama, null, commentData.id_laporan)
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