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

if (!isset($data['authToken']) || empty($data['authToken'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Brak tokenu sesji.']));
}
if (!isset($data['cena']) || !is_numeric($data['cena'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Nieprawidłowa cena zamówienia.']));
}



$authToken = $data['authToken'];
$cena = (int)$data['cena'];

// Pobranie ID użytkownika na podstawie tokenu
$stmt = $conn->prepare("SELECT id_uzytkownika FROM uzytkownicy WHERE token_sesji = ?");
$stmt->bind_param("s", $authToken);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    die(json_encode(['error' => 'Nieprawidłowy token sesji.']));
}

$userData = $result->fetch_assoc();
$id_uzytkownika = $userData['id_uzytkownika'];
$stmt->close();

// Dodanie zamówienia do bazy danych
$sql = "INSERT INTO zamowienia (id_uzytkownika, cena) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id_uzytkownika, $cena);


if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Zamówienie zostało dodane.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd dodawania zamówienia.']);
}

$stmt->close();
$conn->close();
?>