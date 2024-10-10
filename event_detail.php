<?php
include 'koneksi.php';

$eventId = $_GET['id'] ?? null;
if ($eventId) {
    $data = mysqli_query($conn, "
    SELECT j.*, l.lokasi, l.is_sekolah, d.divisi AS divisi_pj_name
    FROM tb_jadwal j
    JOIN tb_lokasi l ON j.lokasi_id = l.id
    JOIN tb_divisi_pj d ON j.divisi_pj_id = d.id
    WHERE j.id='$eventId'
");
    $event = mysqli_fetch_array($data);
}
?>

<!DOCTYPE html>
<html>

<head>
    <title>Detail Kegiatan</title>
    <link rel="stylesheet" href="lib/bootstrap.min.css">
</head>

<body>
    <div class="container mt-4">
        <h1><?php echo $event['kegiatan']; ?></h1><br>
        <p><strong>Divisi:</strong> <?php echo $event['divisi_pj_name']; ?></p>
        <p><strong>Penganggung Jawab:</strong> <?php echo $event['penganggung_jawab']; ?></p>
        <p><strong>Lokasi:</strong> <?php echo $event['lokasi']; ?> <?php if ($event['is_sekolah'] == 1) echo '(Di Sekolah)';
                                                                    else echo '(Di Luar)'; ?></p>
        <p><strong>Peserta:</strong> <?php echo $event['peserta']; ?></p>
        <p><strong>Mulai:</strong> <?php echo $event['mulai']; ?></p>
        <p><strong>Berakhir:</strong> <?php echo $event['selesai']; ?></p><br>
        <a href="index.php" class="btn btn-primary">Kembali ke Kalender</a>
    </div>
</body>

</html>