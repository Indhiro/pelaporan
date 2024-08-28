const con = require('../config/config');
const { DATABASE } = require('../config/db');
let { asynqQuery,getUser,generateNewStatus, generateRejectedStatus,getFile,generateNotifNotes,responseFormated } = require('../helpers/helpers');

class laporanModel {
    static async getLaporanDashboard(req, res, next) {
        try {
            let { sortBy,type,status,page,pageSize } = req.query;
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
            if (type == 'status' && status != 'null') {
                if (whereCondition == '') whereCondition += ` WHERE tl.status_laporan = '${status}' ` // SELECT FILTER STATUS
                else whereCondition += ` AND tl.status_laporan = '${status}' ` // SELECT FILTER STATUS
            }
            let query = queryGetDataFormated(whereCondition, sortBy, page, pageSize)
            let countLp = await countGetDataFormated(whereCondition)
            
            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image) element.image = await getFile(next, element.image)
            }
            res.send(responseFormated(true, 200, 'Success', { result, totalLp: countLp[0].countLp }));
        } catch (error) {
            console.log('func getLaporanDashboard',error);
            res.send(responseFormated(false, 400, error.message, {}))
        }
    }

    static async getLaporanValidation(req, res, next) {
        try {
            let { sortBy,type,status,page,pageSize } = req.query;
            let userlogin = req.query.userId;
            let searchParam = req.query.search;
            let user = await getUser(userlogin)
            let role = user[0].role;
            let whereCondition = '';
            let where = laporanStatusByRoleValidation(role);
            let laporanCondition = ` tl.status_laporan IN (${where}) `
            if (role == 'petugas') laporanCondition = ` (tl.status_laporan = 'approve_kepala_prodi' and layer = 1) or
            (tl.status_laporan = 'approve_wakil_dekan_2' and layer = 2) or
            (tl.status_laporan = 'approve_wakil_rektor_2' and layer = 3) or
            (tl.status_laporan = 'progress')`
            if (role == 'wakil dekan 2') laporanCondition = ` (tl.status_laporan = 'approve_kepala_prodi' and layer = 2) or
            (tl.status_laporan = 'approve_kepala_prodi' and layer = 3)`
            if (role == 'wakil rektor 2') laporanCondition = ` (tl.status_laporan = 'approve_wakil_dekan_2' and layer = 3)`
            if (user && where) whereCondition = `where ${laporanCondition}`
            if (searchParam) { // SEARCH BAR
                if (whereCondition) {
                    whereCondition += ` AND (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                } else {
                    whereCondition += ` WHERE (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                }
            }
            if (type == 'status' && status != 'null') {
                if (whereCondition == '') whereCondition += ` WHERE tl.status_laporan = '${status}' ` // SELECT FILTER STATUS
                else whereCondition += ` AND tl.status_laporan = '${status}' ` // SELECT FILTER STATUS
            }
            let query = queryGetDataFormated(whereCondition, sortBy, page, pageSize)
            let countLp = await countGetDataFormated(whereCondition)

            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image) element.image = await getFile(next, element.image)
            }

            res.send(responseFormated(true, 200, 'Success', { result, totalLp: countLp[0].countLp }));
        } catch (error) {
            console.log('func getLaporanDashboard',error);
            res.send(responseFormated(false, 400, error.message, {}))
        }
    }

    static async getLaporanHistory(req, res, next) {
        // KALAU BISA AMBIL PER 10 - 20 data saja per load (buat pagination)
        try {
            let { sortBy,type,status,page,pageSize } = req.query;
            let userlogin = req.query.userId;
            let searchParam = req.query.search;
            let user = await getUser(userlogin)
            let whereCondition = '';
            if (user) whereCondition = `where tl.status_laporan IN ('done')` // JIKE LEMPAR PARAM userId, pake filter, kalo ga ya ga
            if (searchParam) {
                if (whereCondition) {
                    whereCondition += ` AND (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                } else {
                    whereCondition += ` WHERE (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                }
            }

            let query = queryGetDataFormated(whereCondition, sortBy, page, pageSize)
            let countLp = await countGetDataFormated(whereCondition)

            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image) element.image = await getFile(next, element.image)
            }
            res.send(responseFormated(true, 200, 'Success', { result, totalLp: countLp[0].countLp }));
        } catch (error) {
            console.log('func getLaporanHistory',error);
            res.send(responseFormated(false, 400, error.message, {}))
        }
    }

    static async getLaporanRejected(req, res, next) {
        try {
            let { sortBy,type,status,page,pageSize } = req.query;
            let userlogin = req.query.userId;
            let searchParam = req.query.search;
            let user = await getUser(userlogin)
            let whereCondition = '';
            if (user) whereCondition = `where tl.status_laporan IN ('rejected')` // JIKE LEMPAR PARAM userId, pake filter, kalo ga ya ga
            if (searchParam) {
                if (whereCondition) {
                    whereCondition += ` AND (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                } else {
                    whereCondition += ` WHERE (tl.category like '%${searchParam}%' or tl.title like '%${searchParam}%' 
                    or tl.text like '%${searchParam}%' or tu.nama like '%${searchParam}%')`
                }
            }

            let query = queryGetDataFormated(whereCondition, sortBy, page, pageSize)
            let countLp = await countGetDataFormated(whereCondition)
            let result = await asynqQuery(query)
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.image) element.image = await getFile(next, element.image)
            }
            res.send(responseFormated(true, 200, 'Success', { result, totalLp: countLp[0].countLp }));
        } catch (error) {
            console.log('func getLaporanRejected',error);
            res.send(responseFormated(false, 400, error.message, {}))
        }
    }

    static getTrendLaporan(req, res, next) {
        let queryTbLaporan = `SELECT * FROM ${DATABASE}.tb_laporan`
        let queryTbLikeDislike = `SELECT point_like_dislike FROM ${DATABASE}.tb_like_dislike`
        let queryTbComment = `SELECT point_comment FROM ${DATABASE}.tb_comment`
        let queryTbReport = `SELECT point_report FROM ${DATABASE}.tb_report`
        con.query(queryTbLaporan, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static async uploadLaporan(req, res, next) {
        let laporanData = {
            id_user_pelapor: +req.body.userIdLogin,
            status_laporan: `submitted`, // BY DEFAULT
            category: req.body.kategori,
            title: req.body.judul,
            text: req.body.keterangan,
            image: req.file.path ? req.file.path : null,
            id_pengawas: 0
        }
        laporanData.id_pengawas =  await getLatestPengawas();
        // FILE NYA UDAH MASUK, CEK FUNCTION MASUKIN FILENYA DI ROUTER(MIDDLEWARE)
        let query = `INSERT INTO ${DATABASE}.tb_laporan SET ?`;
        con.query(query, laporanData, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });

        let query2 = `update ${DATABASE}.tb_user set total_laporan = total_laporan + 1 where id_user = ${laporanData.id_pengawas}`
        con.query(query2, function(err, result, fields) {
            if (err) throw err;
        });
    }

    static async updateLaporan(req, res, next) {
        let { id_laporan, category, title, text, lokasi_longitude, lokasi_latitude, image, layer } = req.body;
        let updated_at = `CURRENT_TIMESTAMP`;
        let query = `UPDATE ${DATABASE}.tb_laporan SET `;

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
        let id_laporan = req.query.id_laporan

        let query = `UPDATE ${DATABASE}.tb_laporan SET deleted_at = CURRENT_TIMESTAMP 
        WHERE id_laporan = ${id_laporan} AND deleted_at IS NULL;`;

        con.query(query, function(err, result,  fields) {
            if (err) throw err;
            res.send(result);
        });
    }

    static async approveLaporan(req, res, next) {
        try {
            let { id_laporan, userlogin, catatan, user_penerima } = req.body;
            let query = `select * from ${DATABASE}.tb_laporan tl where tl.id_laporan = ${+id_laporan}`;
            let getLaporan = await asynqQuery(query)
            let getUsers = await getUser(userlogin)
            let getUserPenerima = await getUser(user_penerima)
            let laporan = getLaporan[0];
            let user = getUsers[0];
            let userPenerima = getUserPenerima[0];
            let layer = 0;
            // console.log(userPenerima);
            if (userPenerima){
                if (userPenerima.role == 'kepala prodi') layer = 1;
                if (userPenerima.role == 'wakil dekan 2') layer = 2;
                if (userPenerima.role == 'wakil rektor 2') layer = 3;
            }
          
            if (laporan && user) {
                if (laporan.status_laporan != 'submitted') layer = laporan.layer
                let resGenerateStatus = generateNewStatus(laporan, user, layer) //harus ada teruskan di selanjutnya
                if (resGenerateStatus) {
                    let updateUserIdToLaporan = '';
                    if (adjustCol(resGenerateStatus.status)) updateUserIdToLaporan = `,${adjustCol(resGenerateStatus.status)} = ${resGenerateStatus.userId}`
                    let updateUserByRole = '';
                    if (user.role == 'pengawas') {
                        updateUserByRole = `, id_user_penerima = ${+user_penerima}, layer = ${+layer}`
                    }
                    let updateQuery = `update ${DATABASE}.tb_laporan tl set
                    tl.status_laporan = '${resGenerateStatus.status}'
                    ${updateUserIdToLaporan}
                    ${updateUserByRole}
                    where tl.id_laporan = ${id_laporan}`;
                    await asynqQuery(updateQuery) // EXECUTE QUERY UPDATE

                    //INSERt INTO tb_approve
                    let approveQuery = `INSERT INTO ${DATABASE}.tb_approve SET
                    id_user = '${userlogin}', id_laporan = '${id_laporan}', role = '${user.role}', status = 'approved', catatan = '${catatan}'`
                    await asynqQuery(approveQuery) // EXECUTE QUERY UPDATE
                    await generateNotifNotes('approve', laporan.id_user_pelapor, user.nama, user.role, id_laporan) // NOTIFICATION
                    await generateNotifNotes('approve', userPenerima.id_user, user.nama, user.role, id_laporan) // NOTIFICATION
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
            let query = `select * from ${DATABASE}.tb_laporan tl where tl.id_laporan = ${+id_laporan}`;
            let getLaporan = await asynqQuery(query)
            let getUsers = await getUser(userlogin)
            let laporan = getLaporan[0];
            let user = getUsers[0]
    
            if (laporan && user) {
                let resGenerateStatus = generateRejectedStatus(laporan, user)
                if (resGenerateStatus) {
                    let updateUserIdToLaporan = '';
                    if (adjustCol(resGenerateStatus.status)) updateUserIdToLaporan = `,${adjustCol(resGenerateStatus.status)} = ${resGenerateStatus.userId}`
                    let updateQuery = `update ${DATABASE}.tb_laporan tl set
                    tl.status_laporan = '${resGenerateStatus.status}'  
                    ${updateUserIdToLaporan}
                    where tl.id_laporan = ${id_laporan}`;
                    await asynqQuery(updateQuery) // EXECUTE QUERY UPDATE

                    let rejectQuery = `INSERT INTO ${DATABASE}.tb_approve SET
                    id_user = '${userlogin}', id_laporan = '${id_laporan}', role = '${user.role}', status = 'rejected', catatan = '${catatan}'`
                    
                    await asynqQuery(rejectQuery) // EXECUTE QUERY UPDATE
                    await generateNotifNotes('reject', laporan.id_user_pelapor, user.nama, user.role, id_laporan) // NOTIFICATION
                }    
            }
            res.status(200).send('success reject')
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
    }

    static async getApproveByLaporanId(req, res, next) {
        // return res.send('ok') // DIQUERY NYA TB APPROVE EMG ADA?
        try {
            let id_laporan = req.query.LapId;
            let query = `select ta.*, tu.nama, tu.role
                        from ${DATABASE}.tb_approve ta 
                        left join ${DATABASE}.tb_user tu
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

    static async recapitulationReprot(req, res, next) {
        try {
            let queryRecap = `SELECT 
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 1) as JAN,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 2) as FEB,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 3) as MAR,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 4) as APR,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 5) as MAY,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 6) as JUN,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 7) as JUL,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 8) as AUG,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 9) as SEP,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 10) as OKT,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 11) as NOV,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 12) as DES
            FROM ${DATABASE}.tb_laporan tl LIMIT 1`

            let queryRecapDone = `SELECT 
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 1 AND tl.status_laporan = 'done') as JAN,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 2 AND tl.status_laporan = 'done') as FEB,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 3 AND tl.status_laporan = 'done') as MAR,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 4 AND tl.status_laporan = 'done') as APR,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 5 AND tl.status_laporan = 'done') as MAY,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 6 AND tl.status_laporan = 'done') as JUN,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 7 AND tl.status_laporan = 'done') as JUL,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 8 AND tl.status_laporan = 'done') as AUG,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 9 AND tl.status_laporan = 'done') as SEP,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 10 AND tl.status_laporan = 'done') as OKT,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 11 AND tl.status_laporan = 'done') as NOV,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 12 AND tl.status_laporan = 'done') as DES
            FROM ${DATABASE}.tb_laporan tl LIMIT 1`

            let queryRecapReject = `SELECT 
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 1 AND tl.status_laporan = 'rejected') as JAN,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 2 AND tl.status_laporan = 'rejected') as FEB,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 3 AND tl.status_laporan = 'rejected') as MAR,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 4 AND tl.status_laporan = 'rejected') as APR,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 5 AND tl.status_laporan = 'rejected') as MAY,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 6 AND tl.status_laporan = 'rejected') as JUN,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 7 AND tl.status_laporan = 'rejected') as JUL,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 8 AND tl.status_laporan = 'rejected') as AUG,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 9 AND tl.status_laporan = 'rejected') as SEP,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 10 AND tl.status_laporan = 'rejected') as OKT,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 11 AND tl.status_laporan = 'rejected') as NOV,
            (select count(id_laporan) from ${DATABASE}.tb_laporan tl where MONTH(tl.created_at) = 12 AND tl.status_laporan = 'rejected') as DES
            FROM ${DATABASE}.tb_laporan tl LIMIT 1`

            let result = await asynqQuery(queryRecap);
            let resultDone = await asynqQuery(queryRecapDone);
            let resultReject = await asynqQuery(queryRecapReject);
            res.send(responseFormated(true, 200, 'Success', {
                recap: result,
                recapDone: resultDone,
                recapReject: resultReject
            }))
        } catch (error) {
            console.log('recapitulationReprot', error);
            res.send(responseFormated(true, 400, error.message, []));
        }
    }
    
}

function adjustCol(status) {
    // if (status == 'approve_pengawas') return `id_pengawas`;
    if (status == 'approve_kepala_prodi') return `id_kepala_prodi`;
    if (status == 'approve_wakil_dekan_2') return `id_wakil_dekan_2`;
    if (status == 'approve_wakil_rektor_2') return `id_wakil_rektor_2`;
    if (status == 'progress') return `id_petugas`;
    return null
}

function laporanStatusByRoleDashboard(role) {
    if (role == 'mahasiswa') return `'submitted','approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check'`;
    if (role == 'dosen') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check'`;
    if (role == 'pengawas') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check'`;
    if (role == 'kepala prodi') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check'`;
    if (role == 'wakil dekan 2') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check'`;
    if (role == 'wakil rektor 2') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check'`;
    if (role == 'petugas') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check'`;
    return null
}

function laporanStatusByRoleValidation(role) {
    if (role == 'mahasiswa') return `'test'`;
    if (role == 'dosen') return `'test'`;
    if (role == 'pengawas') return `'submitted','check'`;
    if (role == 'kepala prodi') return `'approve_pengawas'`;
    if (role == 'wakil dekan 2') return `'approve_kepala_prodi'`;
    if (role == 'wakil rektor 2') return `'approve_wakil_dekan_2'`;
    if (role == 'petugas') return `'approve_kepala_prodi', 'approve_wakil_dekan_2', 'approve_wakil_rektor_2', 'progress'`;
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
        let query = `select tu.id_user ,tu.total_laporan , tu.nama  from  ${DATABASE}.tb_user tu where tu.role = 'pengawas' and tu.total_laporan = (
        select min( ${DATABASE}.tb_user.total_laporan) from ${DATABASE}.tb_user where tb_user.role = 'pengawas'
        ) limit 1;`
        let latestUser = await asynqQuery (query);
        id_user =  latestUser[0].id_user
        return id_user
    } catch (error) {
        console.log('error get latest pengawas', error);
    }
}

function queryGetDataFormated(whereCondition, sortBy, page, pageSize) {
    let orderBy = 'total_point desc';
    let page_size = pageSize ? pageSize : 3; // BRAPA SEKALI AMBIL
    let page_number = (((page && page > 0) ? page : 1) - 1) * page_size; // PAGE KEBERAPA || (page_number - 1) * page_size
    if (sortBy) {
        let arrSortBy = sortBy.split(',');
        if (arrSortBy[0] == 'date') orderBy = `created_at ${arrSortBy[1]}`
        if (arrSortBy[0] == 'point') orderBy = `total_point ${arrSortBy[1]}`
    }
    if (whereCondition == '') whereCondition += ` WHERE tl.deleted_at is null `
    else whereCondition += ` AND tl.deleted_at is null `
    let query = `SELECT tl.*, tu.nama, tu.role, tu.point_role, tuun.nama_penerima, tuun.role, tuun2.nama_petugas,
        ((SELECT IF(tlds.countLike, tlds.countLike, 0)) - (SELECT IF(tldis2.countDislike, tldis2.countDislike, 0))) as countLikeDislike,
        ((SELECT IF(tld3.point_like, tld3.point_like, 0)) - (SELECT IF(tld4.point_dislike, tld4.point_dislike, 0)) +
        (SELECT IF(tc2.point_comment, tc2.point_comment, 0)) - (SELECT IF(tr2.point_report, tr2.point_report, 0))) 
        as total_point 
        FROM ${DATABASE}.tb_laporan tl
        left join (SELECT COUNT(tld.id_like_dislike) as countLike, tld.id_laporan
            FROM ${DATABASE}.tb_like_dislike tld
            WHERE tld.status_like_dislike = 'like' group by tld.id_laporan) tlds
            on tl.id_laporan = tlds.id_laporan
        left join (SELECT COUNT(tldis1.id_like_dislike) as countDislike, tldis1.id_laporan
            FROM ${DATABASE}.tb_like_dislike tldis1
            WHERE tldis1.status_like_dislike = 'dislike' group by tldis1.id_laporan) tldis2
            on tl.id_laporan = tldis2.id_laporan
        left join ${DATABASE}.tb_user tu
            on tl.id_user_pelapor = tu.id_user
        left join (select tuu2.nama as nama_petugas, tuu2.id_user
            from ${DATABASE}.tb_user tuu2) tuun2 on tl.id_user_pelapor = tuun2.id_user
        left join (select tuu.nama as nama_penerima, tuu.id_user, tuu.role
            from ${DATABASE}.tb_user tuu) tuun on tl.id_user_penerima = tuun.id_user
        left join (
            select sum(tld2.point_like_dislike) as point_like, tld2.id_laporan
            from ${DATABASE}.tb_like_dislike tld2
            WHERE tld2.status_like_dislike = 'like' group by tld2.id_laporan 
            ) tld3 on tl.id_laporan = tld3.id_laporan
        left join (
            select sum(tld2.point_like_dislike) as point_dislike, tld2.id_laporan
            from ${DATABASE}.tb_like_dislike tld2
            WHERE tld2.status_like_dislike = 'dislike' group by tld2.id_laporan 
            ) tld4 on tl.id_laporan = tld4.id_laporan
        left join (select sum(tc.point_comment) as point_comment, tc.id_laporan
            from ${DATABASE}.tb_comment tc
            group by tc.id_laporan) tc2
            on tl.id_laporan = tc2.id_laporan
        left join (select sum(tr.point_report) as point_report, tr.id_laporan
            from ${DATABASE}.tb_report tr
            group by tr.id_laporan) tr2
            on tl.id_laporan = tr2.id_laporan
        ${whereCondition} order by ${orderBy} LIMIT ${page_size} OFFSET ${page_number};
    `
    return query
}

async function countGetDataFormated(whereCondition) {
    let query = `SELECT COUNT(tl.id_laporan) as countLp FROM ${DATABASE}.tb_laporan tl ${whereCondition}`;
    let result = await asynqQuery(query)
    return result;
}

module.exports = laporanModel;