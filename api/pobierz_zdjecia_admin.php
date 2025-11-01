<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "culturify";
$assets_dir = "/assets/";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Błąd połączenia z bazą danych']));
}

$sql = "SELECT nazwa, tekst, id_zdjecia FROM galeria WHERE czy_dodane = 0"; // Pobieramy id_zdjecia, nazwę i tekst
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $images = [];
    while ($row = $result->fetch_assoc()) {
        $images[] = [
            'id_zdjecia' => $row['id_zdjecia'],
            'src' => $assets_dir . $row['nazwa'],
            'text' => $row['tekst'],
        ];
    }
    echo json_encode($images);
} else {
    echo json_encode([]);
}

$conn->close();
?>