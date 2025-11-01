<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

$host = 'localhost';
$db = 'culturify';
$user = 'root';
$pass = '';

// Połączenie z bazą danych
$dsn = "mysql:host=$host;dbname=$db;charset=utf8";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit;
}

// Odczyt danych z żądania
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id_biletu'])) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

$idBiletu = $input['id_biletu'];

try {
    $pdo->beginTransaction();

    // Sprawdzenie biletu i pobranie id_uzytkownika oraz id_wydarzenia
    $stmt = $pdo->prepare("SELECT id_uzytkownika, id_wydarzenia FROM bilety WHERE id_biletu = :id_biletu");
    $stmt->execute(['id_biletu' => $idBiletu]);
    $bilet = $stmt->fetch();

    if (!$bilet) {
        echo json_encode(["error" => "Ticket not found"]);
        exit;
    }

    $userId = $bilet['id_uzytkownika'];
    $eventId = $bilet['id_wydarzenia'];

    // Zmiana wartości kolumny id_uzytkownika w tabeli bilety na NULL
    $stmt = $pdo->prepare("UPDATE bilety SET id_uzytkownika = NULL WHERE id_biletu = :id_biletu");
    $stmt->execute(['id_biletu' => $idBiletu]);

    // Pobranie wartości ceny z tabeli wydarzenia
    $stmt = $pdo->prepare("SELECT cena FROM wydarzenia WHERE id_wydarzenia = :id_wydarzenia");
    $stmt->execute(['id_wydarzenia' => $eventId]);
    $event = $stmt->fetch();

    if (!$event) {
        echo json_encode(["error" => "Event not found"]);
        exit;
    }

    $cena = $event['cena'];

    // Dodanie wartości ceny do portfela użytkownika
    $stmt = $pdo->prepare("UPDATE uzytkownicy SET portfel = portfel + :cena WHERE id_uzytkownika = :id_uzytkownika");
    $stmt->execute(['cena' => $cena, 'id_uzytkownika' => $userId]);

    $pdo->commit();

    echo json_encode([
        "success" => "Ticket exhibited successfully",
        "user_id" => $userId,
        "event_id" => $eventId,
        "added_to_wallet" => $cena
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["error" => "Failed to exhibit ticket: " . $e->getMessage()]);
}
?>
