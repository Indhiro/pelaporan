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

function generateNewStatus(laporan, userLogin, teruskan) {
    let status = laporan.status_laporan;
    let userRole = userLogin.role;
    if (status == 'submitted' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'approve_pengawas' };
    if (status == 'approve_pengawas' && userRole == 'kepala prodi') {
        if (teruskan == true) return { userId: userLogin.id_user, status: 'approve_kepala_prodi' }; // END CASE 1
        if (teruskan == false) return { userId: userLogin.id_user, status: 'final_approve' }; // END CASE 1
    }
    if (status == 'approve_kepala_prodi' && userRole == 'wakil dekan 2') {
        if (teruskan == true) return { userId: userLogin.id_user, status: 'approve_wakil_dekan_2' }; // END CASE 1
        if (teruskan == false) return { userId: userLogin.id_user, status: 'final_approve' }; // END CASE 1
    }
    if (status == 'approve_wakil_dekan_2' && userRole == 'wakil rektor 2') return { userId: userLogin.id_user, status: 'final_approve' }; // END CASE 2
    if (status == 'final_approve' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'progress' }; // PETUGAS MENGERJAKAN LAPORAN/KERUSAKAN
    if (status == 'progress' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'check' }; // PETUGAS SELESAI MENGERJAKAN DAN MENGUBAH STATUS KE CHECK AGAR DILAKUKAN PENGECEKAN
    if (status == 'check' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'done' };
    return null
}

function generateRejectedStatus(laporan, userLogin) {
    let status = laporan.status_laporan;
    let userRole = userLogin.role;
    if (status == 'submitted' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'rejected' }; // BUTUH NOTES
    if (status == 'approve_pengawas' && userRole == 'kepala prodi') return { userId: userLogin.id_user, status: 'rejected' }; // END CASE 1
    if (status == 'approve_kepala_prodi' && userRole == 'wakil dekan 2') return { userId: userLogin.id_user, status: 'rejected' };
    if (status == 'approve_wakil_dekan_2' && userRole == 'wakil rektor 2') return { userId: userLogin.id_user, status: 'rejected' }; // END CASE 2
    if (status == 'final_approve' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'rejected' }; // PETUGAS MENGERJAKAN LAPORAN/KERUSAKAN
    if (status == 'progress' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'rejected' }; // PETUGAS SELESAI MENGERJAKAN DAN MENGUBAH STATUS KE CHECK AGAR DILAKUKAN PENGECEKAN
    if (status == 'check' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'rejected' };
    return null
}

module.exports = {
    asynqQuery,
    getUser,
    generateNewStatus,
    generateRejectedStatus
}