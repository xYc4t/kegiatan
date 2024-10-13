<?php
include 'con.php';
$data = mysqli_query($conn, 'SELECT * FROM tb_divisi_pj');
$divisi = [];
while ($d = mysqli_fetch_array($data)) {
    $divisi[] = $d;
}
echo json_encode($divisi);