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

$result = mysqli_query($conn, "SELECT id FROM tb_lokasi WHERE lokasi = '$lokasi'");
$lokasiId = null;

if (mysqli_num_rows($result) > 0) {
  $lokasiId = mysqli_fetch_assoc($result)['id'];
} else {
  mysqli_query($conn, "INSERT INTO tb_lokasi (lokasi) VALUES ('$lokasi')");
  $lokasiId = mysqli_insert_id($conn);
}

if ($action === 'delete' && !empty($eventId)) {
  $sql = "DELETE FROM tb_jadwal WHERE id='$eventId'";
  mysqli_query($conn, $sql);
} else {
  if (!empty($eventId)) {
    $sql = "UPDATE tb_jadwal SET kegiatan='$kegiatan', penganggung_jawab='$penganggung_jawab', lokasi_id='$lokasiId', peserta='$peserta', mulai='$mulai', selesai='$selesai' WHERE id='$eventId'";
  } else {
    $sql = "INSERT INTO tb_jadwal (kegiatan, penganggung_jawab, lokasi_id, peserta, mulai, selesai) VALUES ('$kegiatan', '$penganggung_jawab', '$lokasiId', '$peserta', '$mulai', '$selesai')";
  }

  mysqli_query($conn, $sql);
}

header('Location: index.php');
exit;
?>