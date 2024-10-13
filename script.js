document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const currentMonthEventList = document.getElementById('currentMonthEventList');
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
        const event = info.event;
        const { extendedProps } = event;

        $('#eventId').val(event.id);
        $('#kegiatan').val(event.title);
        $('#penganggung_jawab').val(extendedProps.penganggung_jawab || '');
        $('#peserta').val(extendedProps.peserta || '');
        $('#mulai').val(event.start.toISOString().slice(0, 16));
        $('#selesai').val(event.end ? event.end.toISOString().slice(0, 16) : '');

        if (extendedProps.is_sekolah) {
            $('#lokasi_type_sekolah').prop('checked', true);
            $('#lokasiSelect').val(extendedProps.lokasi);
            $('#lokasi_luar').hide();
            $('#lokasi_sekolah').show();
        } else {
            $('#lokasi_type_luar').prop('checked', true);
            $('#lokasi').val(extendedProps.lokasi);
            $('#lokasi_sekolah').hide();
            $('#lokasi_luar').show();
        }

        $('#action').val('update');
        $('#deleteButton').show();
        $('#eventModal').modal('show');

        toggleLokasiInput();
    }

    function updateEventLists() {
        const events = calendar.getEvents();
        const currentMonthStart = new Date(calendar.getDate().getFullYear(), calendar.getDate().getMonth(), 1);
        const nextMonthStart = new Date(currentMonthStart);
        nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

        currentMonthEventList.innerHTML = '';
        upcomingEventList.innerHTML = '';

        events.sort((a, b) => new Date(a.start) - new Date(b.start));

        const currentMonthEvents = events.filter(event => new Date(event.start) >= currentMonthStart && new Date(event.start) < nextMonthStart);
        if (currentMonthEvents.length > 0) {
            currentMonthEvents.forEach(event => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerText = `${event.start.toLocaleString('id-ID')}\n${event.title}`;
                listItem.onclick = () => window.location.href = `event_detail.php?id=${event.id}`;
                currentMonthEventList.appendChild(listItem);
            });
        } else {
            currentMonthEventList.innerHTML = '<li class="list-group-item">Tidak ada kegiatan untuk bulan yang sedang dilihat ^-^</li>';
        }

        const upcomingEvent = events.find(event => new Date(event.start) >= new Date());

        if (upcomingEvent) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerText = `${upcomingEvent.start.toLocaleString('id-ID')}\n${upcomingEvent.title}`;
            listItem.onclick = () => window.location.href = `event_detail.php?id=${upcomingEvent.id}`;
            upcomingEventList.appendChild(listItem);
        } else {
            upcomingEventList.innerHTML = '<li class="list-group-item">Tidak ada kegiatan mendatang :3</li>';
        }
    }

    function resetModal() {
        $('#eventId').val('');
        $('#action').val('');
        $('#deleteButton').hide();
        $('#kegiatan').val('');
        $('#penganggung_jawab').val('');
        $('#lokasi').val('');
        $('#peserta').val('');
        $('#mulai').val('');
        $('#selesai').val('');
    }

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
});