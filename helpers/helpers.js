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

function generateNewStatus(laporan, userLogin, layer) {
  // enum('submitted','approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','approve_wakil_rektor_2','rejected','progress','check','done','deleted')
  // console.log("layer", layer);
    let status = laporan.status_laporan;
    let userRole = userLogin.role;
    if (status == 'submitted' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'approve_pengawas'};
    
    //IF UNTUK PENGAWAS DI DULUANKAN
    if (status == 'approve_kepala_prodi' && userRole == 'petugas' && layer == 1) return { userId: userLogin.id_user, status: 'progress'};
    if (status == 'approve_wakil_dekan_2' && userRole == 'petugas' && layer == 2) return { userId: userLogin.id_user, status: 'progress'};
    if (status == 'approve_wakil_rektor_2' && userRole == 'petugas' && layer == 3) return { userId: userLogin.id_user, status: 'progress'};
    if (status == 'progress' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'check'};
    if (status == 'check' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'done'};
    console.log(status, userRole, layer);
    //IF UNTUK PENANGGUNG JAWAB
    if (status == 'approve_pengawas' && userRole == 'kepala prodi') return { userId: userLogin.id_user, status: 'approve_kepala_prodi'};
    if (status == 'approve_kepala_prodi' && userRole == 'wakil dekan 2') return { userId: userLogin.id_user, status: 'approve_wakil_dekan_2'};
    if (status == 'approve_wakil_dekan_2' && userRole == 'wakil rektor 2') return { userId: userLogin.id_user, status: 'approve_wakil_rektor_2'};


  //   if (status == 'approve_pengawas' && userRole == 'kepala prodi' && layer == 'kepala prodi') {
  //     if (layer == 'kepala prodi') return { userId: userLogin.id_user, status: 'final_approve' }; // END CASE 1
  //     if (layer == true) return { userId: userLogin.id_user, status: 'approve_kepala_prodi' }; // END CASE 1
  //   }
  //   if (status == 'approve_kepala_prodi' && userRole == 'wakil dekan 2') {
  //     if (layer == true) return { userId: userLogin.id_user, status: 'approve_wakil_dekan_2' }; // END CASE 1
  //     if (layer == false) return { userId: userLogin.id_user, status: 'final_approve' }; // END CASE 1
  //   }
  //   if (status == 'approve_wakil_dekan_2' && userRole == 'wakil rektor 2') return { userId: userLogin.id_user, status: 'final_approve' }; // END CASE 2
  //   if (status == 'final_approve' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'progress' }; // PETUGAS MENGERJAKAN LAPORAN/KERUSAKAN
  //   if (status == 'progress' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'check' }; // PETUGAS SELESAI MENGERJAKAN DAN MENGUBAH STATUS KE CHECK AGAR DILAKUKAN PENGECEKAN
  //   if (status == 'check' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'done' };
  //   return null
  
}

function generateRejectedStatus(laporan, userLogin) {
    let status = laporan.status_laporan;
    let userRole = userLogin.role;
    if (status == 'submitted' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'rejected' }; // BUTUH NOTES
    if (status == 'approve_pengawas' && userRole == 'kepala prodi') return { userId: userLogin.id_user, status: 'rejected' }; // END CASE 1
    if (status == 'approve_kepala_prodi' && userRole == 'wakil dekan 2') return { userId: userLogin.id_user, status: 'rejected' };
    if (status == 'approve_wakil_dekan_2' && userRole == 'wakil rektor 2') return { userId: userLogin.id_user, status: 'rejected' }; // END CASE 2
    if (status == 'approve_kepala_prodi' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'rejected' }; // PETUGAS MENGERJAKAN LAPORAN/KERUSAKAN
    if (status == 'approve_wakil_dekan_2' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'rejected' }; // PETUGAS MENGERJAKAN LAPORAN/KERUSAKAN
    if (status == 'approve_wakil_rektor_2' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'rejected' }; // PETUGAS MENGERJAKAN LAPORAN/KERUSAKAN
    if (status == 'progress' && userRole == 'petugas') return { userId: userLogin.id_user, status: 'rejected' }; // PETUGAS SELESAI MENGERJAKAN DAN MENGUBAH STATUS KE CHECK AGAR DILAKUKAN PENGECEKAN
    if (status == 'check' && userRole == 'pengawas') return { userId: userLogin.id_user, status: 'rejected' };
    return null
}

function uploadFile() {
    const timestamp = Date.now();
    // console.log(timestamp);
    return imageUpload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const path = `uploads/${timestamp}`;
          // console.log("INI BMW", path);
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
  // console.log("INI PATH",path);
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