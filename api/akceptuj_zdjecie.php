<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

if (isset($data['id_zdjecia'])) {
    $id_zdjecia = $data['id_zdjecia'];

    $sql = "UPDATE galeria SET czy_dodane = 1 WHERE id_zdjecia = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_zdjecia);


    if ($stmt->execute()) {
           echo json_encode(['success' => true, 'message' => 'Zdjęcie zaakceptowane']);
    } else {
         http_response_code(500);
         echo json_encode(['success' => false, 'message' => 'Błąd podczas aktualizacji rekordu: ' . $stmt->error]);
    }
       $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Nieprawidłowe dane wejściowe']);
}

$conn->close();
?>