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

if (!isset($data['id_postu']) || !is_numeric($data['id_postu'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Nieprawidłowe id_postu.']));
}

if (!isset($data['tresc']) || empty($data['tresc'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Treść posta nie może być pusta.']));
}

$id_postu = (int)$data['id_postu'];
$tresc = $data['tresc'];

$sql = "UPDATE posty SET tresc = ? WHERE id_postu = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $tresc, $id_postu);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['message' => 'Post został zaktualizowany.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd aktualizacji posta.']);
}

$stmt->close();
$conn->close();
?>