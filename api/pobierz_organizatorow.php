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

$sql = "SELECT id_organizatora, nazwa FROM organizatorzy WHERE 1=1";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $organizatorzy = array();
    while ($row = $result->fetch_assoc()) {
        $organizatorzy[] = $row;
    }

    echo json_encode($organizatorzy);
} else {
    echo json_encode(array());
}

$conn->close();
?>