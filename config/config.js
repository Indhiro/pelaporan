var mysql = require('mysql');
const mybd = require('./db');

var con = mysql.createConnection({
    database: mybd.DATABASE,
    host: mybd.HOST,
    user: mybd.USER,
    password: mybd.PASSWORD,
    port: mybd.PORT
})

con.connect(function (err) {
    if (err) throw err;
    //Query create database dan table if not exists
    let queryDb = `CREATE DATABASE IF NOT EXISTS ${mybd.DATABASE}`
    con.query(queryDb, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbUser, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbLaporan, function(err, result, fields) {
        if (err) throw err;
    });
    // con.query(createTable.queryTbChat, function(err, result, fields) {
    //     if (err) throw err;
    // });
    con.query(createTable.queryTbLikeDislike, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbComment, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbReport, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbApprove, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbNotification, function(err, result, fields) {
        if (err) throw err;
    });
    console.log("Database connected!");
});

//Query create table
const createTable = {
    queryTbUser: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_user (
        id_user int NOT NULL AUTO_INCREMENT,
        role enum('mahasiswa','dosen','pengawas','petugas','kepala prodi','wakil dekan 2','wakil rektor 2','admin'),
        point_role int,
        email varchar(255) NOT NULL,
        username varchar(255) NOT NULL,
        nama varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        gender enum ('male', 'female') NOT NULL,
        no_unik varchar(255) NOT NULL,
        no_telp varchar(20) NOT NULL,
        image varchar(255),
        total_laporan int,
        is_validate boolean,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_user)
    )`,
    queryTbLaporan: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_laporan (
        id_laporan int NOT NULL AUTO_INCREMENT,
        id_user_pelapor int NOT NULL,
        id_user_penerima int,
        id_pengawas int NOT NULL,
        id_kepala_prodi int,
        id_wakil_dekan_2 int,
        id_wakil_rektor_2 int,
        id_petugas int,
        status_laporan enum ('submitted','approve_pengawas','approve_kepala_prodi','approve_wakil_dekan_2','approve_wakil_rektor_2','rejected','progress','check','done','deleted') DEFAULT 'submitted',
        category enum ('infrastruktur', 'pendidikan', 'organisasi', 'lainnya'),
        layer int,
        title varchar(100) NOT NULL,
        text text NOT NULL,
        image varchar(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_laporan),
        FOREIGN KEY (id_user_pelapor) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_user_penerima) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_pengawas) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_kepala_prodi) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_wakil_dekan_2) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_wakil_rektor_2) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_petugas) REFERENCES tb_user(id_user)
    )`,
    // queryTbChat: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_chat (
    //     id_chat int NOT NULL AUTO_INCREMENT,
    //     id_user_pengguna int NOT NULL,
    //     id_user_petugas int NOT NULL,
    //     id_laporan int NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP,
    //     deleted_at TIMESTAMP,
    //     PRIMARY KEY (id_chat),
    //     FOREIGN KEY (id_user_pengguna) REFERENCES tb_user(id_user),
    //     FOREIGN KEY (id_user_petugas) REFERENCES tb_user(id_user),
    //     FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan)
    // )`,
    // queryTbChatSender: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_chat_sender (
    //     id_chat_sender int NOT NULL AUTO_INCREMENT,
    //     id_chat int NOT NULL,
    //     id_user_sender int NOT NULL,
    //     text text,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP,
    //     deleted_at TIMESTAMP,
    //     PRIMARY KEY (id_chat_sender),
    //     FOREIGN KEY (id_chat) REFERENCES tb_chat(id_chat),
    //     FOREIGN KEY (id_user_sender) REFERENCES tb_user(id_user)
    // )`,
    queryTbLikeDislike: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_like_dislike (
        id_like_dislike int NOT NULL AUTO_INCREMENT,
        id_user int NOT NULL,
        id_laporan int NOT NULL,
        status_like_dislike enum ('like', 'dislike'),
        point_like_dislike int,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_like_dislike),
        FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan)
    )`,
    queryTbComment: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_comment (
        id_comment int NOT NULL AUTO_INCREMENT,
        id_user int NOT NULL,
        id_laporan int NOT NULL,
        text text,
        point_comment int,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_comment),
        FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan)
    )`,
    queryTbReport: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_report (
        id_report int NOT NULL AUTO_INCREMENT,
        id_user int NOT NULL,
        id_laporan int NOT NULL,
        text text,
        point_report int,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_report),
        FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan)
    )`,
    queryTbApprove: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_approve (
        id_approve int NOT NULL AUTO_INCREMENT,
        id_user int NOT NULL,
        id_laporan int NOT NULL,
        role enum('mahasiswa','dosen','pengawas','petugas','kepala prodi','wakil dekan 2','wakil rektor 2','admin'),
        status enum('approved','rejected'),
        catatan text,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_approve),
        FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan)
    )`,
    queryTbNotification: `CREATE TABLE IF NOT EXISTS ${mybd.DATABASE}.tb_notification (
        id_notification int NOT NULL AUTO_INCREMENT,
        id_laporan int NOT NULL,
        id_user int NOT NULL,
        notes varchar(255) NOT NULL,
        seen boolean,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_notification),
        FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan),
        FOREIGN KEY (id_user) REFERENCES tb_user(id_user)
    )`,
}

module.exports = con;