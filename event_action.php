<?php
include 'con.php';

$eventId = $_POST['eventId'] ?? null;
$action = $_POST['action'] ?? null;

$kegiatan = $_POST['kegiatan'];
$divisi_pj_id = $_POST['divisi_pj'];
$penganggung_jawab = $_POST['penganggung_jawab'];
$lokasi_type = $_POST['lokasi_type'];
$lokasi = $_POST['lokasi'];
$peserta = $_POST['peserta'];
$mulai = $_POST['mulai'];
$selesai = $_POST['selesai'];

if ($lokasi_type === 'sekolah') {
  $result = mysqli_query($conn, "SELECT id FROM tb_lokasi WHERE id = '$lokasi' AND is_sekolah = 1");
  $lokasiId = mysqli_fetch_assoc($result)['id'];
} else {
  $result = mysqli_query($conn, "SELECT id FROM tb_lokasi WHERE lokasi = '$lokasi' AND is_sekolah = 0");

  if (mysqli_num_rows($result) > 0) {
    $lokasiId = mysqli_fetch_assoc($result)['id'];
  } else {
    mysqli_query($conn, "INSERT INTO tb_lokasi (lokasi, is_sekolah) VALUES ('$lokasi', 0)");
    $lokasiId = mysqli_insert_id($conn);
  }
}

if ($action === 'delete' && !empty($eventId)) {
  $sql = "DELETE FROM tb_jadwal WHERE id='$eventId'";
  mysqli_query($conn, $sql);
} else {
  if (!empty($eventId)) {
    $sql = "UPDATE tb_jadwal SET kegiatan='$kegiatan', divisi_pj_id='$divisi_pj_id', penganggung_jawab='$penganggung_jawab', lokasi_id='$lokasiId', peserta='$peserta', mulai='$mulai', selesai='$selesai' WHERE id='$eventId'";
  } else {
    $sql = "INSERT INTO tb_jadwal (kegiatan, divisi_pj_id, penganggung_jawab, lokasi_id, peserta, mulai, selesai) VALUES ('$kegiatan', '$divisi_pj_id', '$penganggung_jawab', '$lokasiId', '$peserta', '$mulai', '$selesai')";
  }

  mysqli_query($conn, $sql);
}

header('Location: index.php');
exit;