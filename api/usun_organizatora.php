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

$id = isset($data['id']) ? $data['id'] : null;

if ($id !== null) {
    $sql_delete = "DELETE FROM organizatorzy WHERE id_organizatora='$id'";

    if ($conn->query($sql_delete) === TRUE) {
        echo json_encode(['message' => 'Organizator został usunięty']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Błąd usuwania: ' . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Brak wymaganego identyfikatora lekarza']);
}

$conn->close();
?>


