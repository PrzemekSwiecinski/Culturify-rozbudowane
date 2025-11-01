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
    die(json_encode(['error' => 'Błąd połączenia z bazą danych']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_komentarza']) || !is_numeric($data['id_komentarza'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Nieprawidłowe id_komentarza.']));
}

$id_komentarza = (int)$data['id_komentarza'];

$sql = "UPDATE komentarze SET czy_dodany = 1 WHERE id_komentarza = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_komentarza);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['message' => 'Komentarz został zaakceptowany.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd akceptacji komentarza.']);
}

$stmt->close();
$conn->close();
?>