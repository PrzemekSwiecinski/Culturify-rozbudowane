<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "culturify";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Błąd połączenia z bazą danych']));
}

if (!isset($_GET['id_postu']) || !is_numeric($_GET['id_postu'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Nieprawidłowe id_postu.']));
}

$id_postu = (int)$_GET['id_postu'];

$sql = "SELECT id_komentarza, id_użytkownika, tresc FROM komentarze WHERE id_postu = ? AND czy_dodany = 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_postu);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $comments = array();
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
    echo json_encode($comments);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Brak komentarzy dla danego postu.']);
}

$stmt->close();
$conn->close();
?>