const con = require('../config/config');

class likeDislikeModel {
    static getLikeDislike(req, res, next) {
        let id_laporan = req.body.id_laporan
        let query = `SELECT * FROM ${'`db_laporan`'}.tb_like_dislike 
                    WHERE id_laporan = ${id_laporan}`
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static uploadLikeDislike(req, res, next) {
        let likeDislikeData = {
            id_user: req.body.id_user,
            id_laporan: req.body.id_laporan,
            status_like_dislike: req.body.status_like_dislike,
            point_like_dislike: req.body.point_like_dislike
        }

        let query = `INSERT INTO ${'`db_laporan`'}.tb_like_dislike SET ?`
        con.query(query, likeDislikeData, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static deleteLikeDislike(req, res, next) {
        let id_like_dislike = req.body.id_like_dislike;
        let query = `DELETE FROM ${'`db_laporan`'}.tb_like_dislike WHERE id_like_dislike = ` + id_like_dislike;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }
}

module.exports = likeDislikeModel;