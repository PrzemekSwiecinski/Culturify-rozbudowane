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

$username = isset($data['username']) ? $data['username'] : null;
$password = isset($data['password']) ? $data['password'] : null;

if ($username !== null && $password !== null) {
    $sql = "SELECT * FROM moderatorzy WHERE login = '$username' AND haslo = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $token = bin2hex(random_bytes(32));

        $updateTokenSql = "UPDATE moderatorzy SET token_sesji = '$token' WHERE login = '$username'";
        $conn->query($updateTokenSql);

        echo json_encode(['message' => 'Zalogowano pomyślnie', 'token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Nieprawidłowy login lub hasło']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Brak danych logowania']);
}

$conn->close();
?>