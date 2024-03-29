let dbName = 'db_laporan';
let con = require('../config/config');
let multer = require('multer');
let fs = require('fs-extra');

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

function uploadFile() {
    const timestamp = Date.now();
    console.log(timestamp);
    return imageUpload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const path = `uploads/${timestamp}`;
          fs.mkdirSync(path, { recursive: true })
          cb(null, path);
        },
  
        // By default, multer removes file extensions so let's add them back
        filename: function (req, file, cb) {
          cb(null, Date.now() + '_' + file.originalname);
        }
      }),
      limits: { fileSize: 10000000 },
      fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
          req.fileValidationError = 'Only image files are allowed!';
          return cb(null, false);
        }
        cb(null, true);
      }
    })
}

async function getFile(next, path) {
  try {
    let data = fs.readFileSync(path)
    return data.toString('base64')
  } catch (error) {
    console.log('helpers.js/getFile', error);
    return null
  }
}

module.exports = {
    getFile,
    uploadFile,
    asynqQuery,
    getUser,
    generateNewStatus,
    generateRejectedStatus
}