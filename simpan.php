<?php
include 'koneksi.php';

$eventId = $_POST['eventId'] ?? null;
$action = $_POST['action'] ?? null;

$kegiatan = $_POST['kegiatan'];
$penganggung_jawab = $_POST['penganggung_jawab'];
$lokasi = $_POST['lokasi'];
$peserta = $_POST['peserta'];
$mulai = $_POST['mulai'];
$selesai = $_POST['selesai'];

if ($action === 'delete' && !empty($eventId)) {
  $sql = "DELETE FROM tb_jadwal WHERE id='$eventId'";
  mysqli_query($conn, $sql);
} else {
  if (!empty($eventId)) {
    $sql = "UPDATE tb_jadwal SET kegiatan='$kegiatan', penganggung_jawab='$penganggung_jawab', lokasi='$lokasi', peserta='$peserta', mulai='$mulai', selesai='$selesai' WHERE id='$eventId'";
  } else {
    $sql = "INSERT INTO tb_jadwal (kegiatan, penganggung_jawab, lokasi, peserta, mulai, selesai) VALUES ('$kegiatan', '$penganggung_jawab', '$lokasi', '$peserta', '$mulai', '$selesai')";
  }

  mysqli_query($conn, $sql);
}

header('Location: index.php');
exit;
?>