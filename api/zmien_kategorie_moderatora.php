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

$id_moderatora = (int)$data['id_moderatora'];
$kategoria = $data['kategoria'];

$sql = "UPDATE moderatorzy SET kategoria = ? WHERE id_moderatora = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $kategoria, $id_moderatora);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['message' => 'Kategoria moderatora została zaktualizowana.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd aktualizacji kategorii moderatora.']);
}

$stmt->close();
$conn->close();
?>