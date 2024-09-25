<?php
include 'koneksi.php';
$data = mysqli_query($conn, 'SELECT * FROM tb_jadwal');
$events = [];

while ($d = mysqli_fetch_array($data)) {
    $events[] = [
        'id' => $d['id'],
        'title' => $d['kegiatan'],
        'start' => $d['mulai'],
        'end' => $d['selesai'],
        'extendedProps' => [
            'penganggung_jawab' => $d['penganggung_jawab'],
            'lokasi' => $d['lokasi'],
            'peserta' => $d['peserta']
        ]
    ];
}

echo json_encode($events);
?>