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

$sql = "SELECT id_komentarza, id_postu, id_użytkownika, tresc, czy_dodany FROM komentarze WHERE czy_dodany = 0";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $comments = array();
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
    echo json_encode($comments);
} else {
     echo json_encode([]);
}

$conn->close();
?>