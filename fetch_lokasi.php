<?php
include 'koneksi.php';
if (isset($_POST['lokasi_type']) && $_POST['lokasi_type'] == 'sekolah') {
    $query = "SELECT * FROM tb_lokasi WHERE is_sekolah = 1";
} else {
    $query = "SELECT * FROM tb_lokasi WHERE is_sekolah = 0";
}
$data = mysqli_query($conn, $query);
$lokasi = [];

while ($d = mysqli_fetch_array($data)) {
    $lokasi[] = $d['lokasi'];
}

echo json_encode($lokasi);
