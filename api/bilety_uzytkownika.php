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
    $stmt = $conn->prepare("SELECT id_uzytkownika FROM uzytkownicy WHERE token_sesji = ?");
    $stmt->bind_param("s", $authToken);
    $stmt->execute();
    $resultUserId = $stmt->get_result();

    if ($resultUserId->num_rows > 0) {
        $userData = $resultUserId->fetch_assoc();
        $userId = $userData['id_uzytkownika'];

        $sqlEvents = "SELECT b.id_biletu, w.typ AS typ_wydarzenia, w.nazwa AS nazwa_wydarzenia, w.data AS data, w.godzina AS godzina
                      FROM bilety b
                      INNER JOIN wydarzenia w ON b.id_wydarzenia = w.id_wydarzenia
                      WHERE b.id_uzytkownika = ?";
        $stmtEvents = $conn->prepare($sqlEvents);
        $stmtEvents->bind_param("i", $userId);
        $stmtEvents->execute();
        $resultEvents = $stmtEvents->get_result();

        if ($resultEvents->num_rows > 0) {
            $eventsData = array();
            while ($row = $resultEvents->fetch_assoc()) {
                $eventsData[] = $row;
            }
            echo json_encode($eventsData);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Brak biletów dla tego użytkownika']);
        }
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


