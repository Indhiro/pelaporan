var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Indhiro123",
    // port: '8889'
});

con.connect(function (err) {
    if (err) throw err;
    //Query create database dan table if not exists
    let queryDb = `CREATE DATABASE IF NOT EXISTS db_laporan`
    con.query(queryDb, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbUser, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbLaporan, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbChat, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbLikeDislike, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbComment, function(err, result, fields) {
        if (err) throw err;
    });
    con.query(createTable.queryTbReport, function(err, result, fields) {
        if (err) throw err;
    });
    console.log("Database connected!");
});

//Query create table
const createTable = {
    queryTbUser: `CREATE TABLE IF NOT EXISTS ${'`db_laporan`'}.tb_user (
        id_user int NOT NULL AUTO_INCREMENT,
        role enum ('mahasiswa', 'PIC', 'dosen', 'petugas', 'kepala prodi', 'wakil dekan 2', 'wakil rektor 2'),
        point_rank int,
        username varchar(255) NOT NULL,
        nama varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        gender enum ('laki-laki', 'perempuan') NOT NULL,
        no_unik int NOT NULL,
        no_telp varchar(20) NOT NULL,
        image blob,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_user)
    )`,
    queryTbLaporan: `CREATE TABLE IF NOT EXISTS ${'`db_laporan`'}.tb_laporan (
        id_laporan int NOT NULL AUTO_INCREMENT,
        id_user_pelapor int NOT NULL,
        id_user_penerima int NOT NULL,
        status_laporan enum ('unapprove', 'approve', 'progres', 'check', 'done', 'deleted') DEFAULT 'unapprove',
        category enum ('infrastruktur', 'pendidikan', 'organisasi', 'lainnya'),
        title varchar(100) NOT NULL,
        text text NOT NULL,
        lokasi_longitude int,
        lokasi_latitude int,
        image blob,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_laporan),
        FOREIGN KEY (id_user_pelapor) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_user_penerima) REFERENCES tb_user(id_user)
    )`,
    queryTbChat: `CREATE TABLE IF NOT EXISTS ${'`db_laporan`'}.tb_chat (
        id_chat int NOT NULL AUTO_INCREMENT,
        id_user_pengguna int NOT NULL,
        id_user_petugas int NOT NULL,
        id_laporan int NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_chat),
        FOREIGN KEY (id_user_pengguna) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_user_petugas) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan)
    )`,
    queryTbChatSender: `CREATE TABLE IF NOT EXISTS ${'`db_laporan`'}.tb_chat_sender (
        id_chat_sender int NOT NULL AUTO_INCREMENT,
        id_chat int NOT NULL,
        id_user_sender int NOT NULL,
        text text,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_chat_sender),
        FOREIGN KEY (id_chat) REFERENCES tb_chat(id_chat),
        FOREIGN KEY (id_user_sender) REFERENCES tb_user(id_user)
    )`,
    queryTbLikeDislike: `CREATE TABLE IF NOT EXISTS ${'`db_laporan`'}.tb_like_dislike (
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
    queryTbComment: `CREATE TABLE IF NOT EXISTS ${'`db_laporan`'}.tb_comment (
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
    queryTbReport: `CREATE TABLE IF NOT EXISTS ${'`db_laporan`'}.tb_report (
        id_report int NOT NULL AUTO_INCREMENT,
        id_user int NOT NULL,
        id_laporan int NOT NULL,
        text text,
        point_report int,
        status_report enum ('validasi', 'done') DEFAULT 'validasi',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id_report),
        FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
        FOREIGN KEY (id_laporan) REFERENCES tb_laporan(id_laporan)
    )`,
}

module.exports = con;