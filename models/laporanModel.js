const con = require('../config/config');
let dbName = 'db_laporan'
let { asynqQuery,getUser,generateNewStatus, generateRejectedStatus,getFile } = require('../helpers/helpers');

class laporanModel {
    static async getLaporanDashboard(req, res, next) {
        // KALAU BISA AMBIL PER 10 - 20 data saja per load (buat pagination)

        // let searchParam = req.query.search;
        // let searchData = null;
        // let sampleData = [ // ON DEV (SAMPLE)
        //     {
        //         "id_laporan": 3,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 1,
        //         "status_laporan": "done",
        //         "category": "infrastruktur",
        //         "title": "Toilet rusak",
        //         "text": "air berceceran",
        //         "lokasi_longitude": null,
        //         "lokasi_latitude": null,
        //         "image": await getFile(next,`uploads\\1708581852222\\1708581879704_e46.jpg`),
        //         "created_at": "2024-01-10T13:07:10.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": 2,
        //         "id_user_approver3": 3,
        //         "layer": null,
        //         "id_user_approver4": 8,
        //         "id_petugas": 1,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "petugas",
        //         "point_rank": 1,
        //         "nama_penerima": "San"
        //     },
        //     {
        //         "id_laporan": 5,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 9,
        //         "status_laporan": "done",
        //         "category": "infrastruktur",
        //         "title": "Air keran lantai 2",
        //         "text": "air tumpah",
        //         "lokasi_longitude": 123,
        //         "lokasi_latitude": 321,
        //         "image": null,
        //         "created_at": "2024-01-15T12:12:56.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": 2,
        //         "id_user_approver3": 3,
        //         "layer": null,
        //         "id_user_approver4": 8,
        //         "id_petugas": 1,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "pengawas",
        //         "point_rank": 1,
        //         "nama_penerima": "Lary"
        //     },
        //     {
        //         "id_laporan": 6,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 1,
        //         "status_laporan": "approve_pengawas",
        //         "category": "infrastruktur",
        //         "title": "Gembok pata",
        //         "text": "kunci tidak bisa",
        //         "lokasi_longitude": 123,
        //         "lokasi_latitude": 321,
        //         "image": null,
        //         "created_at": "2024-01-15T12:13:17.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": null,
        //         "id_user_approver3": null,
        //         "layer": null,
        //         "id_user_approver4": null,
        //         "id_petugas": null,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "petugas",
        //         "point_rank": 1,
        //         "nama_penerima": "San"
        //     },
        //     {
        //         "id_laporan": 7,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 1,
        //         "status_laporan": "approve_kepala_prodi",
        //         "category": "infrastruktur",
        //         "title": "Gembok pata",
        //         "text": "kunci tidak bisa",
        //         "lokasi_longitude": 123,
        //         "lokasi_latitude": 321,
        //         "image": null,
        //         "created_at": "2024-01-15T12:13:17.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": null,
        //         "id_user_approver3": null,
        //         "layer": null,
        //         "id_user_approver4": null,
        //         "id_petugas": null,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "petugas",
        //         "point_rank": 1,
        //         "nama_penerima": "San"
        //     },
        //     {
        //         "id_laporan": 8,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 1,
        //         "status_laporan": "approve_wakil_dekan_2",
        //         "category": "infrastruktur",
        //         "title": "Gembok pata",
        //         "text": "kunci tidak bisa",
        //         "lokasi_longitude": 123,
        //         "lokasi_latitude": 321,
        //         "image": null,
        //         "created_at": "2024-01-15T12:13:17.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": null,
        //         "id_user_approver3": null,
        //         "layer": null,
        //         "id_user_approver4": null,
        //         "id_petugas": null,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "petugas",
        //         "point_rank": 1,
        //         "nama_penerima": "San"
        //     },
        //     {
        //         "id_laporan": 9,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 1,
        //         "status_laporan": "final_approve",
        //         "category": "infrastruktur",
        //         "title": "Gembok pata",
        //         "text": "kunci tidak bisa",
        //         "lokasi_longitude": 123,
        //         "lokasi_latitude": 321,
        //         "image": null,
        //         "created_at": "2024-01-15T12:13:17.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": null,
        //         "id_user_approver3": null,
        //         "layer": null,
        //         "id_user_approver4": null,
        //         "id_petugas": null,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "petugas",
        //         "point_rank": 1,
        //         "nama_penerima": "San"
        //     },
        //     {
        //         "id_laporan": 10,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 1,
        //         "status_laporan": "progress",
        //         "category": "infrastruktur",
        //         "title": "Gembok pata",
        //         "text": "kunci tidak bisa",
        //         "lokasi_longitude": 123,
        //         "lokasi_latitude": 321,
        //         "image": null,
        //         "created_at": "2024-01-15T12:13:17.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": null,
        //         "id_user_approver3": null,
        //         "layer": null,
        //         "id_user_approver4": null,
        //         "id_petugas": null,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "petugas",
        //         "point_rank": 1,
        //         "nama_penerima": "San"
        //     },
        //     {
        //         "id_laporan": 11,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 1,
        //         "status_laporan": "check",
        //         "category": "infrastruktur",
        //         "title": "Gembok pata",
        //         "text": "kunci tidak bisa",
        //         "lokasi_longitude": 123,
        //         "lokasi_latitude": 321,
        //         "image": null,
        //         "created_at": "2024-01-15T12:13:17.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": null,
        //         "id_user_approver3": null,
        //         "layer": null,
        //         "id_user_approver4": null,
        //         "id_petugas": null,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "petugas",
        //         "point_rank": 1,
        //         "nama_penerima": "San"
        //     },
        //     {
        //         "id_laporan": 40,
        //         "id_user_pelapor": 5,
        //         "id_user_approver1": 9,
        //         "status_laporan": "done",
        //         "category": "infrastruktur",
        //         "title": "Air Keran rusak",
        //         "text": "Air keran lantai 1 rusak",
        //         "lokasi_longitude": null,
        //         "lokasi_latitude": null,
        //         "image": null,
        //         "created_at": "2024-01-26T05:11:11.000Z",
        //         "updated_at": null,
        //         "deleted_at": null,
        //         "id_user_approver2": 2,
        //         "id_user_approver3": 3,
        //         "layer": 3,
        //         "id_user_approver4": 8,
        //         "id_petugas": 1,
        //         "countLike": null,
        //         "nama": "zayn",
        //         "role": "pengawas",
        //         "point_rank": 1,
        //         "nama_penerima": "Lary"
        //     }
        // ]
        // if (searchParam) searchData = sampleData.filter(el => {
        //     if (el.category.includes(searchParam) || el.text.includes(searchParam) ||
        //     el.category.includes(searchParam) || el.nama.includes(searchParam)) return el
        // })
        // return res.send(searchData ? searchData : sampleData) // DEV
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

            let query = `SELECT tl.*, tlds.countLike, tu.nama, tu.role, tu.point_rank, tuun.nama_penerima, tuun.role, tuun2.nama_petugas
                        FROM ${dbName}.tb_laporan tl
                        left join (SELECT COUNT(tld.id_like_dislike) as countLike, tld.id_laporan
                            FROM ${dbName}.tb_like_dislike tld
                            WHERE tld.status_like_dislike = 'like' group by tld.id_laporan) tlds 
                            on tl.id_laporan = tlds.id_laporan
                        left join db_laporan.tb_user tu
                            on tl.id_user_pelapor = tu.id_user
                        left join (select tuu2.nama as nama_petugas, tuu2.id_user
                            from db_laporan.tb_user tuu2) tuun2 on tl.id_petugas = tuun2.id_user
                        left join (select tuu.nama as nama_penerima, tuu.id_user, tuu.role
                            from db_laporan.tb_user tuu) tuun on tl.id_user_approver1 = tuun.id_user
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
                            from db_laporan.tb_user tuu) tuun on tl.id_user_approver1 = tuun.id_user
                        ${whereCondition}
                        `
            let result = await asynqQuery(query)
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
                            from db_laporan.tb_user tuu) tuun on tl.id_user_approver1 = tuun.id_user
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

    static uploadLaporan(req, res, next) {
        let laporanData = {
            id_user_pelapor: req.body.id_user_pelapor,
            id_user_approver1: req.body.id_user_approver1,
            status_laporan: `submitted`, // BY DEFAULT
            category: req.body.kategori,
            title: req.body.kategori,
            text: req.body.keterangan,
            // lokasi_longitude: req.body.lokasi_longitude,
            // lokasi_latitude: req.body.lokasi_latitude,
            layer: req.body.selectKepada,
            // image: req.file.path
        }
        // FILE NYA UDAH MASUK, CEK FUNCTION MASUKIN FILENYA DI ROUTER(MIDDLEWARE)
        console.log("ini req body", req.body);
        console.log(req.file); // COBA LIHAT DULU, DAN AMBIL PATH NYA DARI req.file -> insert ke db pathnya
        // laporanData.image = req.file
        // return res.status(200).send({
        //     messages: 'done insert'
        // })
        let query = `INSERT INTO ${dbName}.tb_laporan SET ?`;
        // console.log("INI query", query);
        con.query(query, laporanData, function(err, result, fields) {
            // console.log(laporanData);
            if (err) throw err;
            res.send(result);
        });
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
    
            if (laporan && user) {
                let resGenerateStatus = generateNewStatus(laporan, user)
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
                    id_user = '${userlogin}', id_laporan = '${id_laporan}', catatan = '${catatan}'`
                    
                    await asynqQuery(approveQuery) // EXECUTE QUERY UPDATE

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
            let { id_laporan, userlogin } = req.body;
            let query = `select * from ${dbName}.tb_laporan tl where tl.id_laporan = ${+id_laporan}`;
            let getLaporan = await asynqQuery(query)
            let getUsers = await getUser(userlogin)
            let laporan = getLaporan[0];
            let user = getUsers[0]
    
            if (laporan && user) {
                console.log("MASUK KALI");
                let resGenerateStatus = generateRejectedStatus(laporan, user)
                if (resGenerateStatus) {
                    let updateUserIdToLaporan = '';
                    if (adjustCol(resGenerateStatus.status)) updateUserIdToLaporan = `,${adjustCol(resGenerateStatus.status)} = ${resGenerateStatus.userId}`
                    let updateQuery = `update ${dbName}.tb_laporan tl set
                    tl.status_laporan = '${resGenerateStatus.status}'  
                    ${updateUserIdToLaporan}
                    where tl.id_laporan = ${id_laporan}`;
                    await asynqQuery(updateQuery) // EXECUTE QUERY UPDATE
                }
            }
            res.status(200).send('success rejected')
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
    }

    static async getApproveByLaporanId(req, res, next) {
        // return res.send('ok')
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
    if (status == 'approve_pengawas') return `id_user_approver1`;
    if (status == 'approve_kepala_prodi') return `id_user_approver2`;
    if (status == 'approve_wakil_dekan_2') return `id_user_approver3`;
    if (status == 'final_approve') return `id_user_approver4`;
    if (status == 'progress') return `id_petugas`;
    return null
}

function laporanStatusByRoleDashboard(role) {
    if (role == 'mahasiswa') return `'approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','final_approve','progress','check','done'`;
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



module.exports = laporanModel;