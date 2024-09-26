<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalendar Kegiatan</title>
    <link rel="stylesheet" href="lib/bootstrap.min.css">
    <link href='lib/fullcalendar.css' rel='stylesheet' />
</head>
<body>
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
                <h5>Kegiatan Bulan Ini</h5>
                <ul class="list-group" id="currentMonthEventList" style="margin-bottom: 16px"></ul>
                <h5>Kegiatan Mendatang</h5>
                <ul class="list-group" id="upcomingEventList"></ul>
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
                    <form action="simpan.php" method="POST" id="eventForm">
                        <input type="hidden" name="eventId" id="eventId">
                        <input type="hidden" name="action" id="action">
                        <div class="form-group">
                            <label for="kegiatan">Nama Kegiatan</label>
                            <input type="text" name="kegiatan" class="form-control" id="kegiatan" rows="2" required>
                        </div>
                        <div class="form-group">
                            <label for="penganggung_jawab">Penganggung Jawab</label>
                            <input type="text" class="form-control" name="penganggung_jawab" id="penganggung_jawab" required>
                        </div>
                        <div class="form-group">
    <label for="lokasi">Lokasi</label>
    <input type="text" class="form-control" name="lokasi" id="lokasi" list="lokasiList" required>
    <datalist id="lokasiList"></datalist>
</div>
                        <div class="form-group">
                            <label for="peserta">Peserta</label>
                            <textarea name="peserta" class="form-control" id="peserta" rows="2"></textarea>
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

    <script src="lib/jquery-3.2.1.min.js"></script>
    <script src="lib/bootstrap.bundle.min.js"></script>
    <script src='lib/fullcalendar.js'></script>
    <script src='calendar.js'></script>
</body>
</html>