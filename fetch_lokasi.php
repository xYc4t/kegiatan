<?php
include 'con.php';
$data = mysqli_query($conn, 'SELECT * FROM tb_lokasi');
$lokasi = [];
while ($d = mysqli_fetch_array($data)) {
    $lokasi[] = $d;
}
echo json_encode($lokasi);