document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar'),
          twoWeeksFromNowEventList = document.getElementById('twoWeeksFromNowEventList'),
          monthSelect = document.getElementById('monthSelect');

    const handleDateClick = info => {
        resetModal();
        document.getElementById('mulai').value = `${info.dateStr}T07:00`;
        document.getElementById('selesai').value = `${info.dateStr}T08:00`;
        $('#eventModal').modal('show');
    };

    const handleEventClick = info => {
        const event = info.event, { extendedProps } = event;
        $('#eventId').val(event.id);
        $('#kegiatan').val(event.title);
        $('#divisi_pj').val(extendedProps.divisi_pj_id || '');
        $('#penganggung_jawab').val(extendedProps.penganggung_jawab || '');
        $('#peserta').val(extendedProps.peserta || '');
        $('#mulai').val(event.start.toISOString().slice(0, 16));
        $('#selesai').val(event.end ? event.end.toISOString().slice(0, 16) : '');
        (extendedProps.is_sekolah == 1 ? ()=>{
            $('#lokasi_type_sekolah').prop('checked', true);
            $('#lokasiSelect').val(extendedProps.lokasi_id || '');
        } : ()=>{
            $('#lokasi_type_luar').prop('checked', true);
            $('#lokasi').val(extendedProps.lokasi || '');
        })();
        $('#action').val('update');
        $('#deleteButton').show();
        $('#eventModal').modal('show');
        toggleLokasiInput();
    };

    const updateEventLists = () => {
        const events = calendar.getEvents(),
              today = new Date(),
              twoWeeksLater = new Date(today);
        twoWeeksLater.setDate(today.getDate() + 14);

        const filteredEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));
        const twoWeeksEvents = filteredEvents.filter(e => new Date(e.start) >= today && new Date(e.start) < twoWeeksLater);

        twoWeeksFromNowEventList.innerHTML = twoWeeksEvents.length ? twoWeeksEvents.map(e => `<li class="list-group-item" onclick="location.href='event_detail.php?id=${e.id}'">${e.start.toLocaleString('id-ID')}\n${e.title}</li>`).join('') :
            '<li class="list-group-item">Tidak ada kegiatan dalam dua minggu ke depan. ^-^</li>';

        const upcomingEvent = filteredEvents.find(e => new Date(e.start) >= today);
        upcomingEventList.innerHTML = upcomingEvent ? `<li class="list-group-item" onclick="location.href='event_detail.php?id=${upcomingEvent.id}'">${upcomingEvent.start.toLocaleString('id-ID')}\n${upcomingEvent.title}</li>` :
            '<li class="list-group-item">Tidak ada kegiatan mendatang :3</li>';
    };

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'id',
        initialView: 'dayGridMonth',
        dateClick: handleDateClick,
        eventClick: handleEventClick,
        datesSet: updateEventLists,
    });

    const fetchData = (url, callback) => $.get(url, data => callback(JSON.parse(data)));

    const fetchEvents = () => {
        $.get('fetch_events.php', data => {
            const events = JSON.parse(data);
            calendar.removeAllEvents();
            events.forEach(event => calendar.addEvent(event));
            updateEventLists();
        });
    };    

    const populateSelect = (select, options, defaultText, valueKey = 'value', textKey = 'text') => {
        select.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt[valueKey];
            option.textContent = opt[textKey];
            select.appendChild(option);
        });
    };

    const populateMonthSelect = () => {
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        populateSelect(monthSelect, months.map((m, i) => ({ value: i, text: `${m} ${new Date().getFullYear()}` })), 'Pilih Bulan');
    };

    const populateDivisiPJSelect = () => fetchData('fetch_divisipj.php', divisiPJList => {
        populateSelect(document.getElementById('divisi_pj'), divisiPJList, 'Pilih Divisi', 'id', 'divisi');
    });

    const toggleLokasiInput = () => {
        const isSekolah = document.getElementById('lokasi_type_sekolah').checked;
        document.getElementById('lokasi_sekolah').style.display = isSekolah ? 'block' : 'none';
        document.getElementById('lokasi_luar').style.display = isSekolah ? 'none' : 'block';
        document.getElementById('lokasiSelect').required = isSekolah;
        document.getElementById('lokasi').required = !isSekolah;
    };

    const setHiddenValue = () => {
        document.getElementById('hiddenLokasi').value = document.getElementById('lokasi_type_sekolah').checked ?
            document.getElementById('lokasiSelect').value : document.getElementById('lokasi').value;
    };

    const populateLocationOptions = () => fetchData('fetch_lokasi.php', lokasiList => {
        const sekolahOptions = lokasiList.filter(l => l.is_sekolah == 1),
              luarOptions = lokasiList.filter(l => l.is_sekolah != 1);
        populateSelect(document.getElementById('lokasiSelect'), sekolahOptions, 'Pilih Lokasi', 'id', 'lokasi');
        populateSelect(document.getElementById('lokasiList'), luarOptions, 'Pilih Lokasi', 'lokasi', 'lokasi');
    });

    const resetModal = () => {
        ['eventId', 'action', 'kegiatan', 'divisi_pj', 'penganggung_jawab', 'lokasi_type_sekolah', 'lokasi_type_luar', 'lokasiSelect',  'lokasi', 'peserta', 'mulai', 'selesai'].forEach(id => $('#' + id).val(''));
        $('#deleteButton').hide();
    };

    $('#eventForm').on('submit', e => {
        e.preventDefault();
        setHiddenValue();
        $.post('event_action.php', $(e.target).serialize(), () => {
            fetchEvents();
            $('#eventModal').modal('hide');
        });
    });

    $('#deleteButton').on('click', () => $('#action').val('delete') && $('#eventForm').submit());

    monthSelect.addEventListener('change', () => {
        const year = new Date().getFullYear();
        calendar.gotoDate(new Date(year, parseInt(monthSelect.value), 1));
    });

    calendar.render();
    fetchEvents();
    populateMonthSelect();
    populateDivisiPJSelect();
    populateLocationOptions();
    window.toggleLokasiInput = toggleLokasiInput;
    window.setHiddenValue = setHiddenValue;
});