<?php
include 'koneksi.php';

$eventId = $_GET['id'] ?? null;
if ($eventId) {
    $data = mysqli_query($conn, "
        SELECT j.*, l.lokasi 
        FROM tb_jadwal j 
        JOIN tb_lokasi l ON j.lokasi_id = l.id 
        WHERE j.id='$eventId'
    ");
    $event = mysqli_fetch_array($data);
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Kegiatan</title>
    <link rel="stylesheet" href="lib/bootstrap.min.css">
</head>
<body>
    <div class="container mt-4">
        <h2><?php echo $event['kegiatan']; ?></h2>
        <p><strong>Penganggung Jawab:</strong> <?php echo $event['penganggung_jawab']; ?></p>
        <p><strong>Lokasi:</strong> <?php echo $event['lokasi']; ?></p>
        <p><strong>Peserta:</strong> <?php echo $event['peserta']; ?></p>
        <p><strong>Mulai:</strong> <?php echo $event['mulai']; ?></p>
        <p><strong>Berakhir:</strong> <?php echo $event['selesai']; ?></p>
        <a href="index.php" class="btn btn-primary">Kembali ke Kalender</a>
    </div>
</body>
</html>