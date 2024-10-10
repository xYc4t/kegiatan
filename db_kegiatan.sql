CREATE DATABASE IF NOT EXISTS db_kegiatan;

USE db_kegiatan;

DROP TABLE IF EXISTS tb_jadwal;
DROP TABLE IF EXISTS tb_lokasi;

CREATE TABLE tb_lokasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lokasi VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE tb_divisi_pj (
    id INT AUTO_INCREMENT PRIMARY KEY,
    divisi VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE tb_jadwal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan VARCHAR(100) NOT NULL,
    mulai DATETIME NOT NULL,
    selesai DATETIME NOT NULL,
    divisi_pj_id INT NOT NULL,
    penganggung_jawab VARCHAR(50) NOT NULL,
    lokasi_id INT NOT NULL,
    peserta TEXT,
    FOREIGN KEY (divisi_pj_id) REFERENCES tb_divisi_pj(id) ON DELETE CASCADE,
    FOREIGN KEY (lokasi_id) REFERENCES tb_lokasi(id) ON DELETE CASCADE
);