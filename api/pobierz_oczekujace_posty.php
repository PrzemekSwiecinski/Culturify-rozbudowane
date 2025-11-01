<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "culturify";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Błąd połączenia z bazą danych']));
}

$sql = "SELECT id_postu, id_moderatora, id_uzytkownika, kategoria, tresc, czy_dodany FROM posty WHERE czy_dodany = 0";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $posts = array();
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    echo json_encode($posts);
} else {
    echo json_encode([]);
}

$conn->close();
?>