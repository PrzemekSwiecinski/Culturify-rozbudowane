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

if (!isset($data['id_moderatora']) || !is_numeric($data['id_moderatora'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Nieprawidłowe id_moderatora.']));
}


if (!isset($data['kategoria']) || empty($data['kategoria'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Kategoria nie może być pusta.']));
}

if (!isset($data['tresc']) || empty($data['tresc'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Treść postu nie może być pusta.']));
}


$id_moderatora = (int)$data['id_moderatora'];
$kategoria = $data['kategoria'];
$tresc = $data['tresc'];


// Dodanie posta do bazy danych
$sql = "INSERT INTO posty (id_moderatora, kategoria, tresc, czy_dodany) VALUES (?, ?, ?, 0)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $id_moderatora, $kategoria, $tresc);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Post został dodany.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd dodawania postu.']);
}

$stmt->close();
$conn->close();
?>