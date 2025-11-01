<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "culturify";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");

$typ = isset($_GET['typ']) ? $conn->real_escape_string($_GET['typ']) : null;
$miasto = isset($_GET['miasto']) ? $conn->real_escape_string($_GET['miasto']) : null;

$sql = "SELECT id_wydarzenia, id_organizatora, typ, nazwa,  data, godzina, miasto, adres, opis, zdjecie, cena FROM wydarzenia WHERE 1=1";

if ($typ) {
    $sql .= " AND typ = '$typ'";
}

if ($miasto) {
    $sql .= " AND miasto = '$miasto'";
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $wydarzenia = array();
    while ($row = $result->fetch_assoc()) {
        $wydarzenia[] = $row;
    }

    echo json_encode($wydarzenia);
} else {
    echo json_encode(array());
}

$conn->close();
?>