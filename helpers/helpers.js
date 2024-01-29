let dbName = 'db_laporan'
let con = require('../config/config')

function asynqQuery(query, params) {
    return new Promise((resolve, reject) =>{
        con.query(query, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

async function getUser(userId) {
    try {
        let user = await asynqQuery(`select * from ${dbName}.tb_user where id_user = ${userId}`);
        return user
    } catch (error) {
        console.log(error);
    }
}

function generateNewStatus(laporan, userLogin) {
    let status = laporan.status_laporan;
    let userRole = userLogin.role;
    if (status == 'submitted' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'approve1' };
    if (status == 'approve1' && userRole == 'kepala prodi') return { userId: userLogin.id_user, status: 'approve2' }; // END CASE 1
    if (status == 'approve2' && userRole == 'wakil dekan 2') return { userId: userLogin.id_user, status: 'approve3' };
    if (status == 'approve3' && userRole == 'wakil rektor 2') return { userId: userLogin.id_user, status: 'approve4' }; // END CASE 2
    if (status == 'approve4' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'progress' }; // PETUGAS MENGERJAKAN LAPORAN/KERUSAKAN
    if (status == 'progress' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'check' }; // PETUGAS SELESAI MENGERJAKAN DAN MENGUBAH STATUS KE CHECK AGAR DILAKUKAN PENGECEKAN
    if (status == 'check' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'done' };
    return null
}

function generateRejectedStatus(laporan, userLogin) {
    let status = laporan.status_laporan;
    let userRole = userLogin.role;
    if (status == 'submitted' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'rejected' }; // BUTUH NOTES
    if (status == 'approve1' && userRole == 'kepala prodi') return { userId: userLogin.id_user, status: 'rejected' }; // END CASE 1
    if (status == 'approve2' && userRole == 'wakil dekan 2') return { userId: userLogin.id_user, status: 'rejected' };
    if (status == 'approve3' && userRole == 'wakil rektor 2') return { userId: userLogin.id_user, status: 'rejected' }; // END CASE 2
    if (status == 'check' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'progress' };
    return null
}

module.exports = {
    asynqQuery,
    getUser,
    generateNewStatus,
    generateRejectedStatus
}