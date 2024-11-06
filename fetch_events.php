<?php
include 'con.php';

$query = "
    SELECT j.id, j.kegiatan, j.mulai, j.selesai, j.peserta, 
           l.lokasi, l.is_sekolah, l.id AS lokasi_id, 
           d.divisi AS divisi_pj, d.id AS divisi_pj_id, 
           j.penganggung_jawab
    FROM tb_jadwal j 
    LEFT JOIN tb_lokasi l ON j.lokasi_id = l.id
    LEFT JOIN tb_divisi_pj d ON j.divisi_pj_id = d.id
";

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
                'divisi_pj_id' => $d['divisi_pj_id'],
                'divisi_pj' => $d['divisi_pj'],
                'penganggung_jawab' => $d['penganggung_jawab'],
                'lokasi_id' => $d['lokasi_id'],
                'lokasi' => $d['lokasi'],
                'is_sekolah' => $d['is_sekolah'],
                'peserta' => $d['peserta']
            ]
        ];
    }
}

echo json_encode($events);