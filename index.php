<?php
session_start();
if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>Kalendar Kegiatan</title>
    <script src='script.js'></script>
    <link rel="stylesheet" href="lib/bootstrap.min.css">
    <script src="lib/fullcalendar.min.js"></script>
    <script src="lib/jquery.min.js"></script>
    <script src="lib/bootstrap.bundle.min.js"></script>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Kalendar Kegiatan</a>
            <div class="d-flex justify-content-end">
                <a href="?logout=true" class="btn btn-danger">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <div class="col-lg-8">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <select id="monthSelect" class="form-control" style="width: auto;"></select>
                </div>
                <div id="calendar"></div>
            </div>
            <div class="col-lg-4" style="top: 40px">
                <div class="alert alert-warning" role="alert">
                    <h4>Daftar Kegiatan</h4>
                </div>
                <h5>Kegiatan Mendatang</h5>
                <ul class="list-group" id="upcomingEventList"></ul>
                <h5>Kegiatan Dalam 2 Minggu</h5>
                <ul class="list-group" id="twoWeeksFromNowEventList" style="margin-bottom: 16px"></ul>
            </div>
        </div>
    </div>

    <div class="modal fade" id="eventModal" tabindex="-1" role="dialog" aria-labelledby="eventModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="eventModalLabel">Buat/Perbarui Kegiatan</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Tutup">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="event_action.php" method="POST" id="eventForm">
                        <input type="hidden" name="eventId" id="eventId">
                        <input type="hidden" name="action" id="action">
                        <div class="form-group">
                            <label for="kegiatan">Nama Kegiatan</label>
                            <input type="text" name="kegiatan" class="form-control" id="kegiatan" rows="2" placeholder="Nama Kegiatan" required>
                        </div>
                        <p>Penanggung Jawab</p>
                        <div class="form-group row">
                            <div class="col-sm-6">
                                <select id="divisi_pj" name="divisi_pj" class="form-control"></select>
                            </div>
                            <div class="col-sm-6">
                                <input type="text" id="penganggung_jawab" name="penganggung_jawab" class="form-control" placeholder="Nama">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="lokasi">Lokasi</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="lokasi_type" id="lokasi_type_sekolah" value="sekolah" checked>
                                    <label class="form-check-label" for="lokasi_type_sekolah">Di Sekolah</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="lokasi_type" id="lokasi_type_luar" value="luar">
                                    <label class="form-check-label" for="lokasi_type_luar">Di Luar</label>
                                </div>

                                <div id="lokasi_sekolah" style="display: block;">
                                    <select id="lokasiSelect" name="lokasi" class="form-control" required></select>
                                </div>
                                <div id="lokasi_luar" style="display: none;">
                                    <input type="text" class="form-control" id="lokasi" list="lokasiList" placeholder="Lokasi">
                                    <datalist id="lokasiList"></datalist>
                                </div>
                                <input type="hidden" name="lokasi" id="hiddenLokasi">
                            </div>
                            <div class="form-group">
                                <label for="peserta">Peserta</label>
                                <textarea name="peserta" class="form-control" id="peserta" rows="2" placeholder="Peserta"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="mulai">Tanggal Mulai</label>
                                <input type="datetime-local" class="form-control" name="mulai" id="mulai" required>
                            </div>
                            <div class="form-group">
                                <label for="selesai">Tanggal Berakhir</label>
                                <input type="datetime-local" class="form-control" name="selesai" id="selesai" required>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-success">Simpan</button>
                                <button type="button" class="btn btn-danger" id="deleteButton" style="display:none;">Hapus</button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>

</html>