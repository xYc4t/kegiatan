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

//Jadi berantakan hanya untuk memperbaiki bug dimana saat click event di calendar, jam mulai dan jam berakhir tidak di set dengan benar.
//Mungkin orang selanjutnya dapat mengoptimalkan kode ini? Good luck.
function handleEventClick(info) {
    const event = info.event;
    const startDate = event.start;
    const endDate = event.end;

    $('#eventId').val(event.id);
    $('#kegiatan').val(event.title);
    $('#lokasi').val(event.extendedProps.lokasi);
    $('#peserta').val(event.extendedProps.peserta);

    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();

    const endMonth = endDate ? endDate.getMonth() + 1 : startMonth;
    const endDay = endDate ? endDate.getDate() : startDay;
    const endHour = endDate ? endDate.getHours() : startHour;
    const endMinute = endDate ? endDate.getMinutes() : startMinute;

    $('#mulai').val(`${startDate.getFullYear()}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}T${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`);
    $('#selesai').val(`${endDate ? endDate.getFullYear() : startDate.getFullYear()}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`);

    $('#action').val('update');
    $('#deleteButton').show();
    $('#eventModal').modal('show');
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

    $('#eventForm').on('submit', function(e) {
        e.preventDefault();
        $.post('event_action.php', $(this).serialize(), function() {
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