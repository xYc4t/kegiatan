CREATE DATABASE IF NOT EXISTS db_kegiatan;

USE db_kegiatan;

DROP TABLE IF EXISTS tb_jadwal;

CREATE TABLE tb_jadwal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan VARCHAR(100) NOT NULL,
    mulai DATETIME NOT NULL,
    selesai DATETIME NOT NULL,
    penganggung_jawab VARCHAR(50) NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    peserta TEXT
);