const { DATABASE } = require('../config/db');
let con = require('../config/config');
let multer = require('multer');
let fs = require('fs-extra');
var nodemailer = require('nodemailer');

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
        let user = await asynqQuery(`select * from ${DATABASE}.tb_user where id_user = ${userId}`);
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
      //MAX 10 MB
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
    //Convert binary menjadi string base64 
    return data.toString('base64')
  } catch (error) {
    console.log('helpers.js/getFile', error);
    return null
  }
}

async function generateNotifNotes(status, userIdTo, from, role, id_laporan) {
  let notes = null
  if (status == 'approve') notes = `${from}(${role}) has approved a report!`;
  if (status == 'reject') notes = `${from}(${role}) has rejected a report!`;
  if (status == 'comment') notes = `${from} comment your report!`;
  if (status == 'like') notes = `${from} liked your report!`;
  if (status == 'dislike') notes = `${from} disliked your report!`;
  let query = `INSERT INTO ${DATABASE}.tb_notification (id_user, notes, id_laporan)
                VALUES (${userIdTo}, '${notes}', ${id_laporan});`
  let result = await asynqQuery(query)
  if (result) return true
  else return false
}

function responseFormated(flag, status, msg, data) {
  return { flag, status, msg, data }
}

function sendEmailNodemailer(subject, message, toEmail) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    requireTLS: true,
    auth: {
      user: 'indhiropro@gmail.com',
      pass: 'xdfi mggw fsff ertn'
    }
  });
  
  var mailOptions = {
    from: 'indhiropro@gmail.com',
    to: toEmail,
    subject: subject,
    text: message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      return false
    } else {
      console.log('Email sent: ' + info.response);
      return true
    }
  });
}


module.exports = {
  getFile,
  uploadFile,
  asynqQuery,
  getUser,
  generateNewStatus,
  generateRejectedStatus,
  generateNotifNotes,
  responseFormated,
  sendEmailNodemailer
}