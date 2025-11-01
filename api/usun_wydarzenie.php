<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Ustawienia połączenia z bazą danych
$host = 'localhost';
$dbname = 'culturify';
$username = 'root';
$password = '';

try {
    // Tworzenie połączenia z bazą danych
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Odbieranie danych z żądania POST
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->eventId)) {
        $eventId = $data->eventId;

        // Zapytanie SQL do usunięcia wydarzenia
        $sql = "DELETE FROM wydarzenia WHERE id_wydarzenia = :eventId";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);

        // Wykonanie zapytania
        $stmt->execute();

        // Zwrócenie odpowiedzi do klienta (React)
        echo json_encode(array("success" => true));
    } else {
        // Jeśli brak eventId w żądaniu
        echo json_encode(array("success" => false, "message" => "Nieprawidłowe żądanie"));
    }
} catch (PDOException $e) {
    // Obsługa błędów połączenia z bazą danych
    echo json_encode(array("success" => false, "message" => "Błąd bazy danych: " . $e->getMessage()));
}
?>

