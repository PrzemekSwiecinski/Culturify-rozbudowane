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

$login = isset($data['username']) ? $data['username'] : null;
$password = isset($data['password']) ? $data['password'] : null;
$passwordRepeat = isset($data['passwordRepeat']) ? $data['passwordRepeat'] : null;
$name = isset($data['name']) ? $data['name'] : null;
$phone = isset($data['phone']) ? $data['phone'] : null;

if ($login !== null && $password !== null && $passwordRepeat !== null && $name !== null) {
    if ($password === $passwordRepeat) {
        $token = bin2hex(random_bytes(32));

        $sql = "INSERT INTO organizatorzy (login, haslo, nazwa, telefon, token_sesji) VALUES ('$login',
        '$password', '$name', '$phone', '$token')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Rejestracja pomyślna']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Błąd dodawania: ' . $conn->error]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Hasła nie pasują do siebie']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Brak wymaganych danych rejestracji']);
}

$conn->close();
?>