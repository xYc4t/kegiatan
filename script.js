document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const twoWeeksFromNowEventList = document.getElementById('twoWeeksFromNowEventList');
    const upcomingEventList = document.getElementById('upcomingEventList');
    const monthSelect = document.getElementById('monthSelect');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'id',
        initialView: 'dayGridMonth',
        dateClick: handleDateClick,
        eventClick: handleEventClick,
        datesSet: updateEventLists,
    });

    function fetchEvents() {
        $.get('fetch_events.php', function (data) {
            const events = JSON.parse(data);
            calendar.removeAllEvents();
            events.forEach(event => calendar.addEvent(event));
            updateEventLists();
        });
    }

    function populateMonthSelect() {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        monthSelect.innerHTML = '<option value="" disabled selected>Pilih Bulan</option>';

        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.innerText = `${month} ${new Date().getFullYear()}`;
            monthSelect.appendChild(option);
        });
    }

    monthSelect.addEventListener('change', function () {
        const selectedMonth = parseInt(this.value);
        const year = new Date().getFullYear();
        calendar.gotoDate(new Date(year, selectedMonth, 1));
    });

    function populateDivisiPJSelect() {
        $.get('fetch_divisipj.php', function (data) {
            const divisiPJList = JSON.parse(data);
            const divisiPJSelect = document.getElementById('divisi_pj');

            divisiPJSelect.innerHTML = '<option value="" selected disabled hidden>Pilih Divisi</option>';

            divisiPJList.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.divisi;
                divisiPJSelect.appendChild(option);
            });
        })
    }

    function toggleLokasiInput() {
        const isSekolah = document.getElementById('lokasi_type_sekolah').checked;
        const lokasiSekolah = document.getElementById('lokasi_sekolah');
        const lokasiLuar = document.getElementById('lokasi_luar');
        const lokasiSelect = document.getElementById('lokasiSelect');
        const textInput = document.getElementById('lokasi');

        lokasiSekolah.style.display = isSekolah ? 'block' : 'none';
        lokasiLuar.style.display = isSekolah ? 'none' : 'block';

        lokasiSelect.required = isSekolah;
        textInput.required = !isSekolah;
    }

    function setHiddenValue() {
        const hiddenInput = document.getElementById('hiddenLokasi');
        const lokasiSelect = document.getElementById('lokasiSelect');
        const textInput = document.getElementById('lokasi');

        hiddenInput.value = document.getElementById('lokasi_type_sekolah').checked ?
            lokasiSelect.value : textInput.value;
    }

    window.toggleLokasiInput = toggleLokasiInput;
    window.setHiddenValue = setHiddenValue;

    window.onload = toggleLokasiInput;

    function populateLocationOptions() {
        $.get('fetch_lokasi.php', function (data) {
            const lokasiList = JSON.parse(data);

            const dataSelect = document.getElementById('lokasiSelect');
            const datalist = document.getElementById('lokasiList');

            dataSelect.innerHTML = '<option value="" selected disabled hidden>Pilih Lokasi</option>';
            datalist.innerHTML = '';

            lokasiList.forEach(item => {
                if (item.is_sekolah == 1) {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.lokasi;
                    dataSelect.appendChild(option);
                } else {
                    const option = document.createElement('option');
                    option.value = item.lokasi;
                    datalist.appendChild(option);
                }
            });
        })
    }

    function handleDateClick(info) {
        resetModal();
        const selectedDate = info.dateStr;
        document.getElementById('mulai').value = `${selectedDate}T07:00`;
        document.getElementById('selesai').value = `${selectedDate}T08:00`;
        $('#eventModal').modal('show');
    }

    function handleEventClick(info) {
        const { event } = info;
        const { start: startDate, end: endDate, extendedProps } = event;

        $('#eventId').val(event.id);
        $('#kegiatan').val(event.title);
        $('#divisi_pj').val(extendedProps.divisi_pj_id || '');
        $('#penganggung_jawab').val(extendedProps.penganggung_jawab || '');
        $('#peserta').val(extendedProps.peserta || '');

        const formatDateTime = (date) => {
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hour = date.getHours().toString().padStart(2, '0');
            const minute = date.getMinutes().toString().padStart(2, '0');
            return `${date.getFullYear()}-${month}-${day}T${hour}:${minute}`;
        };

        const mulai = formatDateTime(startDate);
        const selesai = formatDateTime(endDate) || mulai;

        $('#mulai').val(mulai);
        $('#selesai').val(selesai);

        if (extendedProps.is_sekolah == 1) {
            $('#lokasi_type_sekolah').prop('checked', true);
            $('#lokasiSelect').val(extendedProps.lokasi_id || '');
        } else {
            $('#lokasi_type_luar').prop('checked', true);
            $('#lokasi').val(extendedProps.lokasi || '');
        }

        $('#action').val('update');
        $('#deleteButton').show();
        $('#eventModal').modal('show');

        toggleLokasiInput();
    }

    function updateEventLists() {
        const events = calendar.getEvents(),
            today = new Date(),
            twoWeeksLater = new Date(today);
        twoWeeksLater.setDate(today.getDate() + 14);

        const filteredEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));
        const twoWeeksEvents = filteredEvents.filter(e => new Date(e.start) >= today && new Date(e.start) < twoWeeksLater);

        twoWeeksFromNowEventList.innerHTML = twoWeeksEvents.length
            ? twoWeeksEvents.map(e => `<li class="list-group-item" onclick="location.href='event_detail.php?id=${e.id}'">${e.start.toLocaleString('id-ID')}<br>${e.title}</li>`).join('')
            : '<li class="list-group-item">Tidak ada kegiatan dalam dua minggu ke depan. ^-^</li>';

        const upcomingEvent = filteredEvents.find(e => new Date(e.start) >= today);
        upcomingEventList.innerHTML = upcomingEvent
            ? `<li class="list-group-item" onclick="location.href='event_detail.php?id=${upcomingEvent.id}'">${upcomingEvent.start.toLocaleString('id-ID')}<br>${upcomingEvent.title}</li>`
            : '<li class="list-group-item">Tidak ada kegiatan mendatang :3</li>';
    };

    function resetModal() {
        $('#eventId').val('');
        $('#action').val('');
        $('#deleteButton').hide();
        $('#kegiatan').val('');
        $('#divisi_pj').val('');
        $('#penganggung_jawab').val('');
        $('#lokasi').val('');
        $('#lokasiSelect').val('');
        $('#peserta').val('');
        $('#mulai').val('');
        $('#selesai').val('');
    }

    const radioSekolah = document.getElementById('lokasi_type_sekolah');
    const radioLuar = document.getElementById('lokasi_type_luar');

    radioSekolah.addEventListener('click', toggleLokasiInput);
    radioLuar.addEventListener('click', toggleLokasiInput);

    $('#eventForm').on('submit', function (e) {
        e.preventDefault();
        setHiddenValue();
        $.post('event_action.php', $(this).serialize(), function () {
            fetchEvents();
            $('#eventModal').modal('hide');
        });
    });

    $('#deleteButton').on('click', function () {
        $('#action').val('delete');
        $('#eventForm').submit();
    });

    calendar.render();
    fetchEvents();
    populateMonthSelect();
    populateDivisiPJSelect();
    populateLocationOptions();
    toggleLokasiInput();
});
