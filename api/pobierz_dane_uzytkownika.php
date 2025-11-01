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

$authToken = isset($data['authToken']) ? $data['authToken'] : null;

if ($authToken !== null) {
    $sql = "SELECT imie, nazwisko, email, telefon, pesel, portfel FROM uzytkownicy WHERE token_sesji = '$authToken'";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        echo json_encode($userData);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Nie znaleziono użytkownika']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Brak wymaganego tokenu sesji']);
}

$conn->close();
?>