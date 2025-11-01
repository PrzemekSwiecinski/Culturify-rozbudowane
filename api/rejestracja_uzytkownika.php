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
$firstName = isset($data['firstName']) ? $data['firstName'] : null;
$lastName = isset($data['lastName']) ? $data['lastName'] : null;
$email = isset($data['email']) ? $data['email'] : null;

if ($login !== null && $password !== null && $passwordRepeat !== null && $firstName !== null && $lastName !== null) {
    if ($password === $passwordRepeat) {
        // Generowanie unikalnego tokena sesji
        $token = bin2hex(random_bytes(32));

        // Wstawienie rekordu z tokenem sesji do bazy danych
        $sql = "INSERT INTO uzytkownicy (login, haslo, imie, nazwisko, email, token_sesji) VALUES ('$login', '$password', '$firstName', '$lastName', '$email', '$token')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Rejestracja pomyślna']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Błąd rejestracji: ' . $conn->error]);
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
