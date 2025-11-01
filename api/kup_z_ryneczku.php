<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Odpowiedź na preflajowe żądanie OPTIONS
    http_response_code(200);
    exit;
}

$host = 'localhost';
$dbname = 'culturify';
$user = 'root';
$pass = '';

// Połączenie z bazą danych
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
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

// Pobranie danych z żądania POST
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->id_biletu) || !isset($data->authToken)) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Nieprawidłowe żądanie"]);
    exit;
}

$id_biletu = $data->id_biletu;
$authToken = $data->authToken;

// Funkcja do pobrania id_uzytkownika na podstawie tokenu sesji
function get_user_id_by_token($authToken, $pdo) {
    try {
        $stmt = $pdo->prepare("SELECT id_uzytkownika FROM uzytkownicy WHERE token_sesji = :token_sesji");
        $stmt->execute(['token_sesji' => $authToken]);
        $user = $stmt->fetch();

        return $user ? $user['id_uzytkownika'] : null;
    } catch (PDOException $e) {
        throw new Exception("Błąd podczas pobierania id użytkownika: " . $e->getMessage());
    }
}

// Pobranie id_uzytkownika na podstawie tokenu sesji
$id_uzytkownika = get_user_id_by_token($authToken, $pdo);

if (!$id_uzytkownika) {
    header("HTTP/1.1 401 Unauthorized");
    echo json_encode(["error" => "Nieprawidłowy token sesji"]);
    exit;
}

// Aktualizacja biletu w bazie danych
try {
    $pdo->beginTransaction();

    // Pobranie ceny biletu
    $stmtPrice = $pdo->prepare("SELECT cena, id_wydarzenia FROM wydarzenia WHERE id_wydarzenia = (SELECT id_wydarzenia FROM bilety WHERE id_biletu = :id_biletu)");
    $stmtPrice->execute(['id_biletu' => $id_biletu]);
    $rowPrice = $stmtPrice->fetch();

    $cena_biletu = $rowPrice['cena'];
    $id_wydarzenia = $rowPrice['id_wydarzenia'];

    // Pobranie id_uzytkownika na podstawie tokenu sesji
    $id_uzytkownika = get_user_id_by_token($authToken, $pdo);

    if (!$id_uzytkownika) {
        header("HTTP/1.1 401 Unauthorized");
        echo json_encode(["error" => "Nieprawidłowy token sesji"]);
        exit;
    }

    // Aktualizacja biletu w tabeli bilety
    $stmtUpdateTicket = $pdo->prepare("UPDATE bilety SET id_uzytkownika = :id_uzytkownika WHERE id_biletu = :id_biletu AND id_uzytkownika IS NULL");
    $stmtUpdateTicket->execute([
        'id_uzytkownika' => $id_uzytkownika,
        'id_biletu' => $id_biletu,
    ]);

    // Sprawdzenie czy zaktualizowano wiersz
    if ($stmtUpdateTicket->rowCount() > 0) {
        // Aktualizacja portfela użytkownika
        $stmtUpdateWallet = $pdo->prepare("UPDATE uzytkownicy SET portfel = portfel - :cena_biletu WHERE id_uzytkownika = :id_uzytkownika");
        $stmtUpdateWallet->execute([
            'cena_biletu' => $cena_biletu,
            'id_uzytkownika' => $id_uzytkownika,
        ]);

//         // Aktualizacja ceny wydarzenia
//         $stmtUpdateEventPrice = $pdo->prepare("UPDATE wydarzenia SET cena = cena - :cena_biletu WHERE id_wydarzenia = :id_wydarzenia");
//         $stmtUpdateEventPrice->execute([
//             'cena_biletu' => $cena_biletu,
//             'id_wydarzenia' => $id_wydarzenia,
//         ]);

        $pdo->commit();
        echo json_encode(["message" => "Kupiono bilet"]);
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Nie udało się kupić biletu"]);
    }
} catch (PDOException $e) {
    $pdo->rollBack();
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => "Błąd podczas przetwarzania żądania: " . $e->getMessage()]);
}
