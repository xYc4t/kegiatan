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
        $.get('fetch_events.php', function(data) {
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

    monthSelect.addEventListener('change', function() {
        const selectedMonth = parseInt(this.value);
        const year = new Date().getFullYear();
        calendar.gotoDate(new Date(year, selectedMonth, 1));
    });

    function populateLocationDatalist() {
        $.get('fetch_lokasi.php', function(data) {
            const lokasiList = JSON.parse(data);
            const datalist = document.getElementById('lokasiList');
            datalist.innerHTML = '';
    
            lokasiList.forEach(lokasi => {
                const option = document.createElement('option');
                option.value = lokasi;
                datalist.appendChild(option);
            });
        });
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
        $('#eventId').val(event.id);
        $('#kegiatan').val(event.title);
        $('#penganggung_jawab').val(event.extendedProps.penganggung_jawab);
        $('#lokasi').val(event.extendedProps.lokasi);
        $('#peserta').val(event.extendedProps.peserta);
        $('#mulai').val(event.start.toISOString().slice(0, 16));
        $('#selesai').val(event.end ? event.end.toISOString().slice(0, 16) : event.start.toISOString().slice(0, 16));
        $('#action').val('update');
        $('#deleteButton').show();
        $('#eventModal').modal('show');
        console.log('Modal shown with start:', $('#mulai').val(), 'end:', $('#selesai').val()); //BUG HERE, DEBUG LATER.
    }
    
    function updateEventLists() {
        const events = calendar.getEvents();
        const currentMonthStart = new Date(calendar.getDate().getFullYear(), calendar.getDate().getMonth(), 1);
        const nextMonthStart = new Date(currentMonthStart);
        nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

        currentMonthEventList.innerHTML = '';
        upcomingEventList.innerHTML = '';

        events.forEach(event => {
            const eventStart = new Date(event.start);
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerText = `${event.start.toLocaleString('id-ID')}\n${event.title}`;
            listItem.onclick = () => window.location.href = `event_detail.php?id=${event.id}`;

            if (eventStart >= currentMonthStart && eventStart < nextMonthStart) {
                currentMonthEventList.appendChild(listItem);
            }

            if (eventStart >= new Date()) {
                upcomingEventList.appendChild(listItem);
            }
        });

        if (!currentMonthEventList.children.length) {
            currentMonthEventList.innerHTML = '<li class="list-group-item">Tidak ada kegiatan untuk bulan yang sedang dilihat ^-^</li>';
        }
        
        if (!upcomingEventList.children.length) {
            upcomingEventList.innerHTML = '<li class="list-group-item">Tidak ada kegiatan mendatang :3</li>';
        }

        monthSelect.value = '';
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

    $('#eventForm').on('submit', function(e) {
        e.preventDefault();
        $.post('simpan.php', $(this).serialize(), function() {
            fetchEvents();
            $('#eventModal').modal('hide');
        });
    });

    $('#deleteButton').on('click', function() {
        $('#action').val('delete');
        $('#eventForm').submit();
    });

    calendar.render();
    fetchEvents();
    populateMonthSelect();
    populateLocationDatalist();
});