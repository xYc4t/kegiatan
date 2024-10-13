<?php
$conn = mysqli_connect('localhost', 'root', '', 'xy_kegiatan');
if (!$conn) {
	die('Connection failed: ' . mysqli_connect_error());
}