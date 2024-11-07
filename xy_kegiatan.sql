-- Membuat database jika belum ada
CREATE DATABASE IF NOT EXISTS xy_kegiatan;

-- Menggunakan database xy_kegiatan
USE xy_kegiatan;

-- Menghapus tabel jika sudah ada sebelumnya
DROP TABLE IF EXISTS tb_user;
DROP TABLE IF EXISTS tb_jadwal;
DROP TABLE IF EXISTS tb_divisi_pj;
DROP TABLE IF EXISTS tb_lokasi;

-- Membuat tabel tb_user
CREATE TABLE tb_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Membuat tabel tb_lokasi
CREATE TABLE tb_lokasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_sekolah BOOLEAN NOT NULL,
    lokasi VARCHAR(255) NOT NULL UNIQUE
);

-- Membuat tabel tb_divisi_pj
CREATE TABLE tb_divisi_pj (
    id INT AUTO_INCREMENT PRIMARY KEY,
    divisi VARCHAR(20) NOT NULL UNIQUE
);

-- Membuat tabel tb_jadwal
CREATE TABLE tb_jadwal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan VARCHAR(255) NOT NULL,
    mulai DATETIME NOT NULL,
    selesai DATETIME NOT NULL,
    divisi_pj_id INT NOT NULL,
    penganggung_jawab VARCHAR(70) NOT NULL,
    lokasi_id INT NOT NULL,
    peserta TEXT,
    FOREIGN KEY (divisi_pj_id) REFERENCES tb_divisi_pj(id) ON DELETE CASCADE,
    FOREIGN KEY (lokasi_id) REFERENCES tb_lokasi(id) ON DELETE CASCADE
);


-- DUMMY START HERE --


INSERT INTO tb_user (username, password) VALUES
('admin', 'admin123'),
('user1', 'password1'),
('user2', 'password2'),
('user3', 'password3'),
('manager', 'managerpass');

INSERT INTO tb_lokasi (is_sekolah, lokasi) VALUES
(true, 'Sekolah XYZ'),
(false, 'Gedung Serbaguna ABC'),
(true, 'Sekolah ABC'),
(false, 'Auditorium DEF'),
(true, 'Sekolah PQR'),
(false, 'Hotel Best Western'),
(true, 'Sekolah DEF');

INSERT INTO tb_divisi_pj (divisi) VALUES
('Acara'),
('Logistik'),
('Keamanan'),
('Kesehatan'),
('Pendaftaran'),
('IT Support');

-- Kegiatan November 2024
INSERT INTO tb_jadwal (kegiatan, mulai, selesai, divisi_pj_id, penganggung_jawab, lokasi_id, peserta) VALUES
('Pendaftaran Peserta', '2024-11-10 08:00:00', '2024-11-10 10:00:00', 1, 'Andi Saputra', 1, 'Peserta A, Peserta B, Peserta C'),
('Sosialisasi Keamanan', '2024-11-10 10:30:00', '2024-11-10 12:00:00', 3, 'Budi Santoso', 4, 'Peserta D, Peserta E'),
('Pembukaan Acara', '2024-11-10 13:00:00', '2024-11-10 14:00:00', 1, 'Citra Dewi', 2, 'Peserta A, Peserta D, Peserta F'),
('Lomba Kebersihan', '2024-11-11 09:00:00', '2024-11-11 11:00:00', 2, 'Eka Prasetyo', 1, 'Peserta B, Peserta E'),
('Sesi Kesehatan', '2024-11-11 14:00:00', '2024-11-11 16:00:00', 4, 'Fani Melati', 3, 'Peserta C, Peserta F');

-- Kegiatan Desember 2024
INSERT INTO tb_jadwal (kegiatan, mulai, selesai, divisi_pj_id, penganggung_jawab, lokasi_id, peserta) VALUES
('Workshop Keamanan Jaringan', '2024-12-02 08:00:00', '2024-12-02 12:00:00', 5, 'Rina Pratiwi', 6, 'Peserta A, Peserta B, Peserta G'),
('Pelatihan Kesehatan Mental', '2024-12-05 09:00:00', '2024-12-05 12:00:00', 4, 'Alfiansyah Indra', 3, 'Peserta D, Peserta H'),
('Acara Penutupan', '2024-12-10 15:00:00', '2024-12-10 17:00:00', 1, 'Gita Sari', 2, 'Peserta E, Peserta F'),
('Lomba Musik Akustik', '2024-12-12 13:00:00', '2024-12-12 15:00:00', 2, 'Teguh Wibowo', 5, 'Peserta B, Peserta I'),
('Seminar IT Terbaru', '2024-12-15 10:00:00', '2024-12-15 12:00:00', 6, 'Lia Nuraini', 4, 'Peserta A, Peserta G, Peserta J');

-- Kegiatan Januari 2025
INSERT INTO tb_jadwal (kegiatan, mulai, selesai, divisi_pj_id, penganggung_jawab, lokasi_id, peserta) VALUES
('Pelatihan Public Speaking', '2025-01-05 08:30:00', '2025-01-05 11:00:00', 1, 'Gina Amalia', 1, 'Peserta A, Peserta F, Peserta K'),
('Konferensi Kepemimpinan', '2025-01-10 13:00:00', '2025-01-10 15:00:00', 5, 'Ari Prasetyo', 6, 'Peserta C, Peserta D'),
('Workshop Fotografi', '2025-01-15 09:00:00', '2025-01-15 12:00:00', 2, 'Rudi Hartono', 2, 'Peserta F, Peserta G'),
('Seminar Perencanaan Keuangan', '2025-01-20 14:00:00', '2025-01-20 16:00:00', 3, 'Lily Handayani', 4, 'Peserta A, Peserta K'),
('Lomba Debat Nasional', '2025-01-25 09:00:00', '2025-01-25 11:00:00', 1, 'Siti Zulaikha', 3, 'Peserta D, Peserta J');

-- Kegiatan Februari 2025
INSERT INTO tb_jadwal (kegiatan, mulai, selesai, divisi_pj_id, penganggung_jawab, lokasi_id, peserta) VALUES
('Seminar Teknologi AI', '2025-02-02 10:00:00', '2025-02-02 12:00:00', 6, 'Fadli Jaya', 5, 'Peserta A, Peserta I'),
('Lomba Cerdas Cermat', '2025-02-10 13:00:00', '2025-02-10 15:00:00', 2, 'Angga Pratama', 1, 'Peserta F, Peserta J'),
('Pelatihan Manajemen Waktu', '2025-02-15 08:00:00', '2025-02-15 10:30:00', 4, 'Vera Rahmawati', 3, 'Peserta G, Peserta D'),
('Workshop Digital Marketing', '2025-02-20 14:00:00', '2025-02-20 16:00:00', 5, 'Kurniawan Setiawan', 2, 'Peserta A, Peserta K'),
('Konser Amal', '2025-02-25 19:00:00', '2025-02-25 22:00:00', 1, 'Aditya Surya', 6, 'Peserta C, Peserta I');
