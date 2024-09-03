const con = require('../config/config');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');
let { asynqQuery,getUser,getFile,responseFormated,sendEmailNodemailer } = require('../helpers/helpers');
const { DATABASE } = require('../config/db');

class userModel {
    static loginUser(req, res, next) {
        try {
            let { username, password } = req.body;
            let isValidate = false;
            //VALIDASI
            if (!username) return res.send({ msg: 'Username empty, please try again!' });
            if (!password) return res.send({ msg: 'Password empty, please try again!' });
            //QUERY
            let query = `SELECT * FROM ${DATABASE}.tb_user 
                    WHERE username = '${username}' AND deleted_at IS NULL`;
            //EXECUTION QUERY
            con.query(query, async function (err, result, fields) {
                if (err) throw err;
                if (result == 0) return res.send({ msg: 'Account not found!' });
                if (bcrypt.compareSync(req.body.password, result[0].password)) {
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        if (element.is_validate) isValidate = true;
                        if (element.image) element.image = await getFile(next, element.image)
                    }
                    if (isValidate === false) return res.send({
                        msg: 'The account has not been validated! Please contact Pengawas'
                    })
                    res.send(result)
                } else {
                    res.send({
                        msg: 'Username or Password Incorrect!'
                    })
                }
            });
        } catch (err) {
            res.status(500).send({ msg: err.message })
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
            let query = `SELECT *, DATE_FORMAT(created_at, "%d-%m-%Y") as dateformated FROM ${DATABASE}.tb_user 
            WHERE deleted_at is null ORDER BY nama ASC`; // AND ts.role != 'petugas'
            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image != "undefined" && element.image) element.image = await getFile(next, element.image)
            }
            res.send(result);
        }
    };

    static async registerUser(req, res, next) {
        try {
            let { role, email, username, fullName, gender, no_unik, no_telp } = req.body; // no_unik dari mana? flow nya gimana?
            let total_laporan = 0;
            let point_role = 0;
            let created_at = `CURRENT_TIMESTAMP`;
            let password = await bcrypt.hash(req.body.password, 10);
            //QUERY1
            let query = `SELECT * FROM ${DATABASE}.tb_user WHERE username = '${username}'`;
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                //Validasi email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.send(responseFormated(false, 400, "Please enter a valid email address!", []));
                }
                //VALIDASI
                if (!fullName) return res.send(responseFormated(false, 400, 'Full Name coloumn can not be empty!', []));
                if (!no_unik) return res.send(responseFormated(false, 400, 'NIM/NIP/NUPTK name coloumn can not be empty!', []));
                if (!email) return res.send(responseFormated(false, 400, 'Email coloumn can not be empty!', []));
                if (!username) return res.send(responseFormated(false, 400, 'Username coloumn can not be empty!', []));
                if (!password) return res.send(responseFormated(false, 400, 'Password coloumn can not be empty!', []));
                if (!role) return res.send(responseFormated(false, 400, 'Role coloumn can not be empty!', []));
                if (role == 'Select Role') return res.send(responseFormated(false, 400, 'Role coloumn can not be empty!', []));
                if (!gender) return res.send(responseFormated(false, 400, 'Gender coloumn can not be empty!', []));
                if (gender  == 'Select Gender') return res.send(responseFormated(false, 400, 'Gender coloumn can not be empty!', []));
                if (!no_telp) return res.send(responseFormated(false, 400, 'Phone number coloumn can not be empty!', []));
                for (let i = 0; i < result.length; i++) {
                    if (username == result[i].username) return res.send(responseFormated(false, 400, 'Username used!, please use another username!', []));
                    if (email == result[i].email) return res.send(responseFormated(false, 400, 'Email used!, please use another email!', []));
                    if (no_unik == result[i].no_unik) return res.send(responseFormated(false, 400, 'NIM/NIP/NUPTK!, please use another NIM/NIP/NUPTK!', []));
                };
                if (role == 'mahasiswa') point_role = 1;
                if (role == 'dosen' || role == 'pengawas' || role == 'petugas') point_role = 2;
                if (role == 'kepala prodi') point_role = 3;
                if (role == 'wakil dekan 2') point_role = 4;
                if (role == 'wakil rektor 2') point_role = 5;
                //QUERY2
                let query2 = `INSERT INTO ${DATABASE}.tb_user SET
                    role = '${role}', point_role = ${point_role}, username = '${username}', nama = '${fullName}', email = '${email}', gender = '${gender}', 
                    no_unik = ${no_unik}, no_telp = '${no_telp}', created_at = ${created_at}, password = '${password}', total_laporan = '${total_laporan}'`;
                con.query(query2, function (err2, result2, fields2) {
                    if (err2) throw err2;
                    res.send(responseFormated(true, 200, '', result2));
                });
            })
        } catch {
            res.status(500).send()
        }
    };

    static async updatePassUser(req, res, next) {
        let { id_user, password } = req.body;
        let new_pass = await bcrypt.hash(req.body.new_pass, 10);
        //VALIDASI
        if (!id_user) return res.send(responseFormated(false, 400, 'Id_user empty, please try again!', []));
        if (!password) return res.send(responseFormated(false, 400, 'Password empty, please try again!', []));
        if (!new_pass) return res.send(responseFormated(false, 400, 'New password empty, please try again!', []));
        //QUERY
        let query = `SELECT password
        FROM ${DATABASE}.tb_user
        WHERE id_user = '${id_user}'`
        con.query(query, function (err, result, fields) {
            let compareResult = bcrypt.compareSync(password, result[0].password);
            
            if (compareResult) {
                let compareResult2 = bcrypt.compareSync(password, new_pass);
                if (compareResult2 == true) return res.send(responseFormated(false, 400, "New password cannot be same as your current password!", []))
                let query2 = `UPDATE ${DATABASE}.tb_user
                SET password = '${new_pass}', updated_at = CURRENT_TIMESTAMP 
                WHERE id_user = '${id_user}'
                AND password = '${result[0].password}'`;
                //EXECUTION QUERY
                con.query(query2, function (err2, result2, fields2) {
                    if (err2) throw err2;
                    //result.message[15] => if 0 account not found, if 1 account found
                    if (result2.message[15] == 0) return res.send(responseFormated(false, 400, 'Account not found!', []))
                    if (result2.changedRows === 1) return res.send(responseFormated(true, 200, 'Password Changed Succesfully!', []))
                    res.send({flag:true, data:result2, msg:"Password changed succesfully"})
                })
            } else {
                console.log('Password wrong!', result[0].password);
                res.send(responseFormated(false, 400, "Current password incorrect!", []))
            }
        })
    };

    static async updateUser(req, res, next) {
        let { id_user, nama, email, gender, no_telp, new_pass } = req.body;
        let image = req.file ? req.file.path : null;
        let convertedImage = ``;
        let query = `UPDATE ${DATABASE}.tb_user SET `;
        let hashedPassword = null;
        if (new_pass) hashedPassword = await bcrypt.hash(new_pass, 10);
        //Validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            console.log("Please enter a valid email address!");
            return res.send(responseFormated(false, 400, "Please enter a valid email address!", []));
        }

        if (image) {
            for (let index = 0; index < image.length; index++) {
                const char = image[index];
                if (char == `\\`) convertedImage += `\\\\\\` // MYSQL TIDAK MEMBACA \ cm 1
                else convertedImage += char
            }
        }
        if(new_pass) query += ` password = '${hashedPassword}',`;
        if(nama) query += ` nama = '${nama}',`;
        if(email) query += ` email = '${email}',`;
        if(gender) query += ` gender = '${gender}',`;
        if(no_telp) query += ` no_telp = '${no_telp}',`;
        if(image) query += ` image = '${convertedImage}',`;
        query += ` updated_at = CURRENT_TIMESTAMP,`
        query = query.slice(0, -1);
        query += ` WHERE id_user = ${id_user}`
        
        console.log(query);
        
        con.query(query, function(err, result,  fields) {
            res.send(responseFormated(true,200, 'Data successfully changed!', {}));   
            if (err) res.send(responseFormated(false, 400, err.message, {}));   
        });

    };

    static deleteUser(req, res, next) {
        let id_user = req.query.id_user
        let query = `UPDATE ${DATABASE}.tb_user SET deleted_at = CURRENT_TIMESTAMP WHERE id_user = ${id_user}`;
        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });

    };

    static async activeValidateUser(req, res, next) {
        let userId = req.query.userId;
        let status = req.query.status;
        let userlogin = req.query.userlogin;
        let user = await getUser(userlogin)
        userlogin = user[0];
        if (userlogin.role != 'admin' && userlogin.role != 'pengawas') return res.send({ msg: `Only admin have an access to this service!` })
        try {
            let query = `
            UPDATE ${DATABASE}.tb_user
            SET is_validate = ${status} 
            WHERE id_user = ${userId};`;
            let result = await asynqQuery(query)
            res.send(result);
        } catch (error) {
            console.log('activeValidateUser', error);
            res.send({
                msg: error.message
            });
        }
    }

    static async forgetPassword(req, res, next) {
        let { email } = req.body;
        try {
            if (email) {
                let query = `SELECT * from ${DATABASE}.tb_user where email = '${email}'`
                let result = await asynqQuery(query);
                if (result[0]) {
                    var token = jwt.sign({ email: email }, 'indhiro');
                    var ref = req.header('origin');
                    let linkReset = `${ref}/laporan/reset.html?token=${token}`
                    let resEmail = sendEmailNodemailer('Forgot Password Pelaporan Apps', 
                        `Untuk reset password silahkan klik link dibawah ini :
                        \n${linkReset}

                        \nTerima kasih`
                        , email);
                        res.send(responseFormated(true, 200, 'Success', {}));
                } else {
                    console.log("NOT FOUND");
                    res.send(responseFormated(false, 400, 'Email not found, please input correct email!', {}));   
                }
            }
        } catch (error) {
            console.log(error);
            res.send(responseFormated(false, 400, error.message, {}));
        }
    }

    static async resetPassword(req, res, next) {
        let { resetPassword,token } = req.body;
        var decoded = jwt.verify(token, 'indhiro');
        let new_pass = await bcrypt.hash(resetPassword, 10);
        try {
            let qSearch = `SELECT * from ${DATABASE}.tb_user where email = '${decoded.email}';`
            let resSearch = await asynqQuery(qSearch);
            //Validasi
            if (resSearch.length == 0) return res.send(responseFormated(false, 404, 'Email not found!', {})); 
            let compareResult = bcrypt.compareSync(resetPassword, resSearch[0].password);
            console.log("COLOK", compareResult);
            if (compareResult == true) return res.send(responseFormated(false, 400, "New password cannot be same as your current password!", []))
            if (decoded) {
                let query = `UPDATE ${DATABASE}.tb_user
                SET password = '${new_pass}' 
                WHERE email = '${decoded.email}';`
                await asynqQuery(query);
                res.send(responseFormated(true, 200, 'Success', {}));
            }  
        } catch (error) {
            console.log(error);
            res.send(responseFormated(false, 400, error.message, {}));   
        }
    }

}

module.exports = userModel;