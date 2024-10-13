<?php
include 'con.php';

$query = '
    SELECT j.id, j.kegiatan, j.mulai, j.selesai, j.peserta, 
           l.lokasi, l.is_sekolah, 
           d.divisi AS divisi_pj
    FROM tb_jadwal j 
    JOIN tb_lokasi l ON j.lokasi_id = l.id
    JOIN tb_divisi_pj d ON j.divisi_pj_id = d.id
';

$data = mysqli_query($conn, $query);
$events = [];

if ($data) {
    while ($d = mysqli_fetch_assoc($data)) {
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
}

echo json_encode($events);
