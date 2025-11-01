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

// Sprawdzenie poprawności JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "error" => "Invalid JSON data",
        "json_error" => json_last_error_msg(),
        "received_data" => file_get_contents('php://input')
    ]);
    exit;
}

if (!isset($input['eventId'], $input['authToken'], $input['ticketCount'])) {
    echo json_encode([
        "error" => "Invalid input data",
        "received_data" => $input
    ]);
    exit;
}

$eventId = $input['eventId'];
$authToken = $input['authToken'];
$ticketCount = $input['ticketCount'];

// Sprawdzenie poprawności tokenu sesji
$stmt = $pdo->prepare("SELECT id_uzytkownika FROM uzytkownicy WHERE token_sesji = :token_sesji");
$stmt->execute(['token_sesji' => $authToken]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(["error" => "Invalid session token"]);
    exit;
}

$userId = $user['id_uzytkownika'];

// Sprawdzenie czy wydarzenie istnieje
$stmt = $pdo->prepare("SELECT cena FROM wydarzenia WHERE id_wydarzenia = :id_wydarzenia");
$stmt->execute(['id_wydarzenia' => $eventId]);
$event = $stmt->fetch();

if (!$event) {
    echo json_encode(["error" => "Event not found"]);
    exit;
}

$cena = $event['cena'];

// Dodanie biletów do tabeli bilety
try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO bilety (id_wydarzenia, id_uzytkownika) VALUES (:id_wydarzenia, :id_uzytkownika)");
    for ($i = 0; $i < $ticketCount; $i++) {
        $stmt->execute(['id_wydarzenia' => $eventId, 'id_uzytkownika' => $userId]);
    }

    // Zmniejszenie wartości portfela użytkownika o wartość cena z tabeli wydarzenia
    $stmt = $pdo->prepare("UPDATE uzytkownicy SET portfel = portfel - :cena WHERE id_uzytkownika = :id_uzytkownika");
    $stmt->execute(['cena' => $cena * $ticketCount, 'id_uzytkownika' => $userId]);

    $pdo->commit();

    echo json_encode([
        "success" => "Tickets purchased successfully",
        "user_id" => $userId,
        "event_id" => $eventId,
        "ticket_count" => $ticketCount,
        "total_cost" => $cena * $ticketCount // Dodatkowo zwrócona wartość całkowitego kosztu zakupu
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["error" => "Failed to purchase tickets: " . $e->getMessage()]);
}
?>

