const con = require('../config/config');

class chatModel {
    static getChat(req, res, next) {
        let { id_user_pengirim, id_user_penerima, id_laporan } = req.body
        let query1 = `SELECT * FROM ${'`db_laporan`'}.tb_chat_sender 
                    WHERE id_user_pengirim = ${id_user_pengirim}
                    AND  id_user_penerima = ${id_user_penerima}
                    AND id_laporan = ${id_laporan}`
        let query = `SELECT * FROM ${'`db_laporan`'}.tb_chat 
                    WHERE id_user_pengirim = ${id_user_pengirim}
                    AND  id_user_penerima = ${id_user_penerima}
                    AND id_laporan = ${id_laporan}`
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static uploadChat(req, res, next) {
        let id_user_penerima = req.body.id_user_penerima;
        let id_user_pengirim = req.body.id_user_pengirim
        let { id_laporan, status_chat, text } = req.body
        
        let query = `INSERT INTO ${'`db_laporan`'}.tb_chat SET 
                    id_user_penerima = ${id_user_penerima}, id_user_pengirim = ${id_user_pengirim},
                    id_laporan = ${id_laporan}, status_chat = '${status_chat}', text = '${text}'`
         
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static updateChat(req, res, next) {
        let { id_chat, text } = req.body;
        let updated_at = `CURRENT_TIMESTAMP`;
        
        let query = `UPDATE ${'`db_laporan`'}.tb_chat SET `;
       
        if(text) query += ` text = '${text}',`;
        query += `updated_at = ${updated_at},`;

        query = query.slice(0, -1);
        query += ` WHERE id_chat = ${id_chat}`

        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static deleteChat(req, res, next) {
        let id_chat = req.body.id_chat;
        let query = `DELETE FROM ${'`db_laporan`'}.tb_chat WHERE id_chat = ` + id_chat;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }
}

module.exports = chatModel;