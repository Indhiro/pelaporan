const con = require('../config/config');
let dbName = 'db_laporan'
let { asynqQuery,getUser,generateNewStatus, generateRejectedStatus,getFile } = require('../helpers/helpers');

class laporanModel {
    static async getLaporanDashboard(req, res, next) {
        // KALAU BISA AMBIL PER 10 - 20 data saja per load (buat pagination)
        try {
            let userlogin = req.query.userId;
            let searchParam = req.query.search;
            let user = await getUser(userlogin)
            let role = user[0].role;
            let whereCondition = '';
            let where = laporanStatusByRoleDashboard(role);
            if (user && where) whereCondition = `where tl.status_laporan IN (${where})` // JIKE LEMPAR PARAM userId, pake filter, kalo ga ya ga
            if (searchParam) {
                if (whereCondition) {
                    whereCondition += ` AND (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                } else {
                    whereCondition += ` WHERE (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                }
            }
            // console.log(role, whereCondition);

            let query = `SELECT tl.*, tlds.countLike, tu.nama, tu.role, tu.point_rank, tuun.nama_penerima, tuun.role, tuun2.nama_petugas
                        FROM ${dbName}.tb_laporan tl
                        left join (SELECT COUNT(tld.id_like_dislike) as countLike, tld.id_laporan
                            FROM ${dbName}.tb_like_dislike tld
                            WHERE tld.status_like_dislike = 'like' group by tld.id_laporan) tlds 
                            on tl.id_laporan = tlds.id_laporan
                        left join db_laporan.tb_user tu
                            on tl.id_user_pelapor = tu.id_user
                        left join (select tuu2.nama as nama_petugas, tuu2.id_user
                            from db_laporan.tb_user tuu2) tuun2 on tl.id_user_pelapor = tuun2.id_user
                        left join (select tuu.nama as nama_penerima, tuu.id_user, tuu.role
                            from db_laporan.tb_user tuu) tuun on tl.id_user_penerima = tuun.id_user
                        ${whereCondition}
                        `
            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image) element.image = await getFile(next, element.image)
                // element.image = await getFile(next, element.image) // AGAK LAMA KALO BYK DATA (MENDING PAGINATION)
            }
            res.send(result);
        } catch (error) {
            console.log('func getLaporanDashboard',error);
            res.send(error.message)
        }
    }

    static async getLaporanValidation(req, res, next) {
        try {
            let userlogin = req.query.userId;
            let searchParam = req.query.search;
            let user = await getUser(userlogin)
            let role = user[0].role;
            let whereCondition = '';
            let where = laporanStatusByRoleValidation(role);
            let laporanCondition = ` tl.status_laporan IN (${where}) `
            if (role == 'petugas') laporanCondition = ` (tl.status_laporan = 'approve_kepala_prodi' and layer = 1) or
            (tl.status_laporan = 'approve_wakil_dekan_2' and layer = 2) or
            (tl.status_laporan = 'approve_wakil_rektor_2' and layer = 3) `
            if (user && where) whereCondition = `where ${laporanCondition}` // JIKE LEMPAR PARAM userId, pake filter, kalo ga ya ga
            if (searchParam) {
                if (whereCondition) {
                    whereCondition += ` AND (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                } else {
                    whereCondition += ` WHERE (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                }
            }

            let query = `SELECT tl.*, tlds.countLike, tu.nama, tu.role, tu.point_rank, tuun.nama_penerima, tuun.role
                        FROM ${dbName}.tb_laporan tl
                        left join (SELECT COUNT(tld.id_like_dislike) as countLike, tld.id_laporan
                            FROM ${dbName}.tb_like_dislike tld
                            WHERE tld.status_like_dislike = 'like' group by tld.id_laporan) tlds 
                            on tl.id_laporan = tlds.id_laporan
                        left join db_laporan.tb_user tu
                            on tl.id_user_pelapor = tu.id_user
                        left join (select tuu.nama as nama_penerima, tuu.id_user, tuu.role
                            from db_laporan.tb_user tuu) tuun on tl.id_user_penerima = tuun.id_user
                        ${whereCondition}
                        `
            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image) element.image = await getFile(next, element.image)
                // element.image = await getFile(next, element.image) // AGAK LAMA KALO BYK DATA (MENDING PAGINATION)
            }
            res.send(result);
        } catch (error) {
            console.log('func getLaporanDashboard',error);
            res.send(error.message)
        }
    }

    static async getLaporanRejected(req, res, next) {
        try {
            let userlogin = req.query.userId;
            let searchParam = req.query.search;
            let user = await getUser(userlogin)
            let role = user[0].role;
            let whereCondition = '';
            let where = laporanStatusByRoleRejected(role);
            if (user && where) whereCondition = `where tl.status_laporan IN (${where})` // JIKE LEMPAR PARAM userId, pake filter, kalo ga ya ga
            if (searchParam) {
                if (whereCondition) {
                    whereCondition += ` AND (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                } else {
                    whereCondition += ` WHERE (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                }
            }

            let query = `SELECT tl.*, tlds.countLike, tu.nama, tu.role, tu.point_rank, tuun.nama_penerima, tuun.role
                        FROM ${dbName}.tb_laporan tl
                        left join (SELECT COUNT(tld.id_like_dislike) as countLike, tld.id_laporan
                            FROM ${dbName}.tb_like_dislike tld
                            WHERE tld.status_like_dislike = 'like' group by tld.id_laporan) tlds 
                            on tl.id_laporan = tlds.id_laporan
                        left join db_laporan.tb_user tu
                            on tl.id_user_pelapor = tu.id_user
                        left join (select tuu.nama as nama_penerima, tuu.id_user, tuu.role
                            from db_laporan.tb_user tuu) tuun on tl.id_user_penerima = tuun.id_user
                        ${whereCondition}
                        `
            let result = await asynqQuery(query)
            res.send(result);
        } catch (error) {
            console.log('func getLaporanDashboard',error);
            res.send(error.message)
        }
    }

    // static async getLaporan(req, res, next) {
    //     let id_laporan = req.body.id_laporan
    //     let query = `SELECT tl.*, tlds.countLike, tu.nama, tu.role, tu.point_rank, tuun.nama_penerima, tuun.role
    //                 FROM ${dbName}.tb_laporan tl
    //                 left join (SELECT COUNT(tld.id_like_dislike) as countLike, tld.id_laporan
    //                     FROM ${dbName}.tb_like_dislike tld
    //                     WHERE tld.status_like_dislike = 'like' group by tld.id_laporan) tlds 
    //                     on tl.id_laporan = tlds.id_laporan
    //                 left join db_laporan.tb_user tu
    //                 	on tl.id_user_pelapor = tu.id_user
    //                 left join (select tuu.nama as nama_penerima, tuu.id_user, tuu.role
    //                 	from db_laporan.tb_user tuu) tuun on tl.id_user_approver1 = tuun.id_user
    //                 `
    //     try {
    //         let result = await asynqQuery(query)
    //         res.send(result);
    //     } catch (error) {
    //         console.log(error);
    //         res.send(error.message)
    //     }
    // }

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

    static async uploadLaporan(req, res, next) {
        // console.log("ini req body", req.body);
        let laporanData = {
            id_user_pelapor: +req.body.userIdLogin,
            // id_user_penerima: +req.body.selectKepada,
            status_laporan: `submitted`, // BY DEFAULT
            category: req.body.kategori,
            title: req.body.judul,
            text: req.body.keterangan,
            image: req.file.path ? req.file.path : null,
            id_pengawas: 0
        }
        laporanData.id_pengawas =  await getLatestPengawas();
        // FILE NYA UDAH MASUK, CEK FUNCTION MASUKIN FILENYA DI ROUTER(MIDDLEWARE)
        let query = `INSERT INTO ${dbName}.tb_laporan SET ?`;
        // console.log("INI query", query);
        con.query(query, laporanData, function(err, result, fields) {
            // console.log(laporanData);
            if (err) throw err;
            res.send(result);
        });

        let query2 = `update ${dbName}.tb_user set total_laporan = total_laporan + 1 where id_user = ${laporanData.id_pengawas}`
        con.query(query2, function(err, result, fields) {
            // console.log(laporanData);
            if (err) throw err;
        });

        // let query3 = `update ${dbName}.tb_laporan set id_pengawas = ${laporanData.id_pengawas} where id_laporan = `
        // con.query(query3, function(err, result, fields) {
        //     // console.log(laporanData);
        //     if (err) throw err;
        // });
    }

    static async updateLaporan(req, res, next) {
        let { id_laporan, category, title, text, lokasi_longitude, lokasi_latitude, image, layer } = req.body;
        let updated_at = `CURRENT_TIMESTAMP`;
        let query = `UPDATE ${dbName}.tb_laporan SET `;

        if(category) query += ` category = '${category}',`;
        if(title) query += ` title = '${title}',`;
        if(text) query += ` text = '${text}',`;
        if(lokasi_longitude) query += ` lokasi_longitude = '${lokasi_longitude}',`;
        if(lokasi_latitude) query += ` lokasi_latitude = '${lokasi_latitude}',`;
        if(image) query += ` image = '${image}',`;
        if(layer) query += ` image = '${layer}',`;
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

    static async approveLaporan(req, res, next) {
        try {
            let { id_laporan, userlogin, catatan } = req.body;
            let query = `select * from ${dbName}.tb_laporan tl where tl.id_laporan = ${+id_laporan}`;
            let getLaporan = await asynqQuery(query)
            let getUsers = await getUser(userlogin)
            let laporan = getLaporan[0];
            let user = getUsers[0]
            console.log("laporan", laporan);
            console.log("user", user);
    
            if (laporan && user) {
                let resGenerateStatus = generateNewStatus(laporan, user) //harus ada teruskan di selanjutnya
                console.log("resGenerateStatus", resGenerateStatus);
                if (resGenerateStatus) {
                    let updateUserIdToLaporan = '';
                    if (adjustCol(resGenerateStatus.status)) updateUserIdToLaporan = `,${adjustCol(resGenerateStatus.status)} = ${resGenerateStatus.userId}`
                    let updateQuery = `update ${dbName}.tb_laporan tl set
                    tl.status_laporan = '${resGenerateStatus.status}'
                    ${updateUserIdToLaporan}
                    where tl.id_laporan = ${id_laporan}`;
                    await asynqQuery(updateQuery) // EXECUTE QUERY UPDATE

                    //INSERt INTO tb_approve
                    
                    let approveQuery = `INSERT INTO ${dbName}.tb_approve SET
                    id_user = '${userlogin}', id_laporan = '${id_laporan}', role = '${user.role}', status = 'approved', catatan = '${catatan}'`
                    
                    await asynqQuery(approveQuery) // EXECUTE QUERY UPDATE
                    console.log("updateQuery", updateQuery);
                    console.log("approveQuery", approveQuery);


                }
            }
            res.status(200).send('success approve')
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
    }

    static async rejectedLaporan(req, res, next) {
        try {
            let { id_laporan, userlogin, catatan } = req.body;
            let query = `select * from ${dbName}.tb_laporan tl where tl.id_laporan = ${+id_laporan}`;
            let getLaporan = await asynqQuery(query)
            let getUsers = await getUser(userlogin)
            let laporan = getLaporan[0];
            let user = getUsers[0]
    
            if (laporan && user) {
                let resGenerateStatus = generateRejectedStatus(laporan, user)
                console.log("resGenerateStatus", resGenerateStatus);
                if (resGenerateStatus) {
                    let updateUserIdToLaporan = '';
                    if (adjustCol(resGenerateStatus.status)) updateUserIdToLaporan = `,${adjustCol(resGenerateStatus.status)} = ${resGenerateStatus.userId}`
                    let updateQuery = `update ${dbName}.tb_laporan tl set
                    tl.status_laporan = '${resGenerateStatus.status}'  
                    ${updateUserIdToLaporan}
                    where tl.id_laporan = ${id_laporan}`;
                    await asynqQuery(updateQuery) // EXECUTE QUERY UPDATE

                    let rejectQuery = `INSERT INTO ${dbName}.tb_approve SET
                    id_user = '${userlogin}', id_laporan = '${id_laporan}', role = '${user.role}', status = 'rejected', catatan = '${catatan}'`
                    
                    await asynqQuery(rejectQuery) // EXECUTE QUERY UPDATE
                }
                
            }
            res.status(200).send('success reject')
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
    }

    static async getApproveByLaporanId(req, res, next) {
        return res.send('ok') // DIQUERY NYA TB APPROVE EMG ADA?
        try {
            let id_laporan = req.query.LapId;
            let query = `select ta.*, tu.nama, tu.role
                        from ${dbName}.tb_approve ta 
                        left join db_laporan.tb_user tu
                            on ta.id_user = tu.id_user
                        where ta.id_laporan = ${+id_laporan}
                        `;
            let result = await asynqQuery(query)
            res.send(result);
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }
    
}

function adjustCol(status) {
    if (status == 'approve_pengawas') return `id_pengawas`;
    if (status == 'approve_kepala_prodi') return `id_kepala_prodi`;
    if (status == 'approve_wakil_dekan_2') return `id_wakil_dekan_2`;
    if (status == 'final_approve') return `id_wakil_rektor_2`;
    if (status == 'progress') return `id_petugas`;
    return null
}

function laporanStatusByRoleDashboard(role) {
    if (role == 'mahasiswa') return `'submitted','approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
    if (role == 'dosen') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
    if (role == 'pengawas') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
    if (role == 'kepala prodi') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
    if (role == 'wakil dekan 2') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
    if (role == 'wakil rektor 2') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
    if (role == 'petugas') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
    return null
}

function laporanStatusByRoleValidation(role) {
    if (role == 'mahasiswa') return `'test'`;
    if (role == 'dosen') return `'test'`;
    if (role == 'pengawas') return `'submitted','check'`;
    if (role == 'kepala prodi') return `'approve_pengawas'`;
    if (role == 'wakil dekan 2') return `'approve_kepala_prodi'`;
    if (role == 'wakil rektor 2') return `'approve_wakil_dekan_2'`;
    if (role == 'petugas') return `'final_approve','progress'`;
    return null
}

function laporanStatusByRoleRejected(role) {
    if (role == 'mahasiswa') return `'rejected'`;
    if (role == 'dosen') return `'rejected'`;
    if (role == 'pengawas') return `'rejected'`;
    if (role == 'kepala prodi') return `'rejected'`;
    if (role == 'wakil dekan 2') return `'rejected'`;
    if (role == 'wakil rektor 2') return `'rejected'`;
    if (role == 'petugas') return `'rejected'`;
    return null
}

async function getLatestPengawas() { // AUTOMATION
    try {
        let id_user
        let query = `select tu.id_user ,tu.total_laporan , tu.nama  from  ${dbName}.tb_user tu where tu.role = 'pengawas' and tu.total_laporan = (
        select min( ${dbName}.tb_user.total_laporan) from ${dbName}.tb_user where tb_user.role = 'pengawas'
        ) limit 1;`
        let latestUser = await asynqQuery (query);
        id_user =  latestUser[0].id_user
        // console.log("id_user", id_user);
        return id_user
    } catch (error) {
        console.log('error get latest pengawas', error);
    }
}

async function showDetails() {
    try {
        let id_user
        let query = `select tu.id_user ,tu.total_laporan , tu.nama  from  ${dbName}.tb_user tu where tu.role = 'pengawas' and tu.total_laporan = (
        select min( ${dbName}.tb_user.total_laporan) from ${dbName}.tb_user where tb_user.role = 'pengawas'
        ) limit 1;`
        let latestUser = await asynqQuery (query);
        id_user =  latestUser[0].id_user
        // console.log("id_user", id_user);
        return id_user
    } catch (error) {
        console.log('error show details', error);
    }
}

// async function 

module.exports = laporanModel;