<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "culturify";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo "Błąd połączenia z bazą danych";
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$organizerId = 1;

$type = $data['type'];
$name = $data['name'];
$date = $data['date'];
$time = $data['time'];
$city = $data['city'];
$address = $data['address'];
$description = $data['description'];
$photo = $data['photo'];
$price = $data['price'];

// Wstawienie danych do bazy danych z użyciem parametryzowanego zapytania
$stmt = $conn->prepare("INSERT INTO wydarzenia (id_organizatora, typ, nazwa, data, godzina, miasto, adres, opis, zdjecie, cena) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssssssss", $organizerId, $type, $name, $date, $time, $city, $address, $description, $photo, $price);

if ($stmt->execute()) {
  echo json_encode(['success' => 'Dodano wydarzenie']);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Błąd dodawania wydarzenia: ' . $stmt->error]);
}
$stmt->close();
?>

