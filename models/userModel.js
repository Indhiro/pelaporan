const con = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let { asynqQuery,getUser,generateNewStatus, generateRejectedStatus, getFile } = require('../helpers/helpers');
let dbName = 'db_laporan'

class userModel {
    static loginUser(req, res, next) {
        try {
            let { username, password } = req.body;
            console.log("username password", username, password);
            //VALIDASI
            if (!username) return res.send('Username empty, please try again!');
            if (!password) return res.send('Password empty, please try again!');
            //QUERY
            let query = `SELECT *
                    FROM ${'`db_laporan`'}.tb_user 
                    WHERE username = '${username}'
                    AND deleted_at IS NULL`;
            //EXECUTION QUERY
            con.query(query, async function (err, result, fields) {
                if (err) throw err;
                if (result == 0) return res.send('Account not found');
                if (bcrypt.compareSync(req.body.password, result[0].password)) {
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        if (element.image) element.image = await getFile(next, element.image)
                    }
                    res.send(result)
                } else {
                    res.send('Password wrong!')
                }
            });
        } catch (err){
            res.status(400);
            console.log('func loginUser',err);
            // res.send(500).send()  
        }
    };

    static async getUser(req, res, next) {
        let userId = req.query.userId;
        if (userId) {
            let user = await getUser(userId);
            for (let index = 0; index < user.length; index++) {
                const element = user[index];
                if (element.image) element.image = await getFile(next, element.image)
            }
            res.send(user);
        } else {
            let query = `SELECT * FROM ${dbName}.tb_user`; // AND ts.role != 'petugas'
            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image) element.image = await getFile(next, element.image)
            }
            res.send(result);
        }
    };

    static async registerUser(req, res, next) {
        try {
            let { role, username, fullName, gender, no_unik, no_telp, image } = req.body; // no_unik dari mana? flow nya gimana?
            let total_laporan = 0;
            let point_role = 0;
            let created_at = `CURRENT_TIMESTAMP`;
            let password = await bcrypt.hash(req.body.password, 10);
            //QUERY1
            let query = `SELECT * FROM ${'`db_laporan`'}.tb_user WHERE username = '${username}'`;
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                //VALIDASI
                if (!username) return res.send('Username coloumn cant be empty!');
                if (!fullName) return res.send('Nama coloumn cant be empty!');
                if (!gender) return res.send('Gender coloumn cant be empty!');
                if (!no_unik) return res.send('No_unik name coloumn cant be empty!');
                if (!no_telp) return res.send('No_telp coloumn cant be empty!');
                for (let i = 0; i < result.length; i++) {
                    if (username == result[i].username) return res.send('Username used!, please use another username!');
                    if (no_unik == result[i].no_unik) return res.send('No_unik used!, please use another no_unik!');
                };
                if (role == 'mahasiswa') point_role = 1;
                if (role == 'dosen' || role == 'pengawas' || role == 'petugas') point_role = 2;
                if (role == 'kepala prodi') point_role = 3;
                if (role == 'wakil dekan 2') point_role = 4;
                if (role == 'wakil rektor 2') point_role = 5;
                //QUERY2
                let query2 = `INSERT INTO ${'`db_laporan`'}.tb_user SET
                    role = '${role}', point_role = ${point_role}, username = '${username}', nama = '${fullName}', gender = '${gender}', 
                    no_unik = ${no_unik}, no_telp = '${no_telp}', image = '${image}', created_at = ${created_at}, password = '${password}', total_laporan = '${total_laporan}'`;
                con.query(query2, function (err2, result2, fields2) {
                    if (err2) throw err2;
                    res.send(result2);
                });
            })
        } catch {
            res.status(500).send()
        }
    };

    static async checkPassUser(req, res, next) {
        let { id_user, password } = req.body;
        let query = `SELECT password
        FROM ${'`db_laporan`'}.tb_user
        WHERE id_user = '${id_user}'`
        con.query(query, function (err, result, fields) {
            if (bcrypt.compareSync(password, result[0].password)) {
                
            }
        })
    }

    static async updatePassUser(req, res, next) {
        let { id_user, password } = req.body;
        let new_pass = await bcrypt.hash(req.body.new_pass, 10);
        let updated_at = `CURRENT_TIMESTAMP`;
        //VALIDASI
        if (!id_user) return res.send('Id_user empty, please try again!');
        if (!password) return res.send('Password empty, please try again!');
        if (!new_pass) return res.send('New password empty, please try again!');
        //QUERY
        let query = `SELECT password
        FROM ${'`db_laporan`'}.tb_user
        WHERE id_user = '${id_user}'`
        con.query(query, function (err, result, fields) {
            if (bcrypt.compareSync(password, result[0].password)) {
                let query2 = `UPDATE ${'`db_laporan`'}.tb_user
                SET password = '${new_pass}', updated_at = ${updated_at}
                WHERE id_user = '${id_user}'
                AND password = '${result[0].password}'`;
                //EXECUTION QUERY
                con.query(query2, function (err2, result2, fields2) {
                    if (err2) throw err2;
                        //result.message[15] => if 0 account not found, if 1 account found
                        if (result2.message[15] == 0) return res.send('Account not found!')
                        if (result2.changedRows === 1) return res.send('Password Changed!')
                        res.send(result2)
                    })
            } else {
                console.log('Password wrong!', result[0].password);
                res.send(result[0].password)
            }
        })
    };

    static async updateUser(req, res, next) {
        let { id_user, nama, gender, no_telp } = req.body;
        let image = req.file.path;
        let convertedImage = ``
        let updated_at = `CURRENT_TIMESTAMP`;
        let query = `UPDATE ${'`db_laporan`'}.tb_user SET `;

        for (let index = 0; index < image.length; index++) {
            const char = image[index];
            if (char == `\\`) convertedImage += `\\\\\\` // MYSQL TIDAK MEMBACA \ cm 1
            else convertedImage += char
        }

        if(nama) query += ` nama = '${nama}',`;
        if(gender) query += ` gender = '${gender}',`;
        if(no_telp) query += ` no_telp = '${no_telp}',`;
        if(image) query += ` image = '${convertedImage}',`;
        query += ` updated_at = ${updated_at},`
        query = query.slice(0, -1);
        query += ` WHERE id_user = ${id_user}`
        
        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });

    };

    static deleteUser(req, res, next) {
        let id_user = req.body.id_user
        let deleted_at = `CURRENT_TIMESTAMP`;

        let query = `UPDATE ${'`db_laporan`'}.tb_user SET `;
        query += ` deleted_at = ${deleted_at},`

        query = query.slice(0, -1);
        query += ` WHERE id_user = ${id_user}`

        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });

    };

}

module.exports = userModel;