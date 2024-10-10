<?php
include 'koneksi.php';
$data = mysqli_query($conn, '
    SELECT j.*, l.lokasi, l.is_sekolah 
    FROM tb_jadwal j 
    JOIN tb_lokasi l ON j.lokasi_id = l.id
');
$events = [];

while ($d = mysqli_fetch_array($data)) {
    $events[] = [
        'id' => $d['id'],
        'title' => $d['kegiatan'],
        'start' => $d['mulai'],
        'end' => $d['selesai'],
        'extendedProps' => [
            'divisi_pj' => $d['divisi_pj'],
            'penganggung_jawab' => $d['penganggung_jawab'],
            'lokasi' => $d['lokasi'],
            'is_sekolah' => $d['is_sekolah'],
            'peserta' => $d['peserta']
        ]
    ];
}

echo json_encode($events);
