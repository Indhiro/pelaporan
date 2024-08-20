const con = require('../config/config');
let dbName = 'db_laporan';
let { asynqQuery,getUser,generateNotifNotes } = require('../helpers/helpers');

class likeDislikeModel {
    static getLikeDislike(req, res, next) {
        let id_laporan = req.query.LapId
        let query = `SELECT * FROM ${dbName}.tb_like_dislike 
                    WHERE id_laporan = ${id_laporan}`
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static async uploadLikeDislike(req, res, next) {
        let queryExecute = ''
        let likeDislikeData = {
            id_user: req.body.id_user,
            id_laporan: req.body.id_laporan,
            status_like_dislike: req.body.status
        }
        let user = await getUser(likeDislikeData.id_user);
        let point_like_dislike = user[0].point_role;
        let query = `select * from ${dbName}.tb_laporan tl where tl.id_laporan = ${+likeDislikeData.id_laporan}`;
        let getLaporan = await asynqQuery(query)
        let laporan = getLaporan[0];
         
        let status = false
        if(likeDislikeData.status_like_dislike == `up`) status = `like`
        if(likeDislikeData.status_like_dislike == `down`) status = `dislike`
        let queryValidation = `SELECT * FROM ${dbName}.tb_like_dislike
                                WHERE id_user = ${+likeDislikeData.id_user}
                                AND id_laporan = ${+likeDislikeData.id_laporan}`
        let resultValidation = await asynqQuery(queryValidation)
        if(resultValidation && resultValidation.length > 0) {
            queryExecute = `UPDATE ${dbName}.tb_like_dislike
                            SET status_like_dislike = '${status}'
                            WHERE id_user = ${+likeDislikeData.id_user}
                            AND id_laporan = ${+likeDislikeData.id_laporan}`
        } else {
            queryExecute = `INSERT INTO ${dbName}.tb_like_dislike (id_user, id_laporan, status_like_dislike, point_like_dislike)
                            VALUES (${+likeDislikeData.id_user}, ${+likeDislikeData.id_laporan}, '${status}', ${point_like_dislike})
                            `
        }
        let resultExecute = await asynqQuery(queryExecute)
        if (status == 'like') await generateNotifNotes('like', laporan.id_user_pelapor, user[0].nama, null, likeDislikeData.id_laporan);
        if (status == 'dislike') await generateNotifNotes('dislike', laporan.id_user_pelapor, user[0].nama, null, likeDislikeData.id_laporan);
        res.send(resultExecute);
    }

    static deleteLikeDislike(req, res, next) {
        let id_like_dislike = req.body.id_like_dislike;
        let query = `DELETE FROM ${dbName}.tb_like_dislike WHERE id_like_dislike = ` + id_like_dislike;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }
}

module.exports = likeDislikeModel;