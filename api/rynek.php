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

if (!isset($input['authToken'])) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

$authToken = $input['authToken'];

// Pobranie biletów z wartością id_uzytkownika=NULL
try {
    $stmt = $pdo->prepare("SELECT b.id_biletu, w.typ, w.nazwa, w.data, w.godzina, w.cena
                           FROM bilety b
                           JOIN wydarzenia w ON b.id_wydarzenia = w.id_wydarzenia
                           WHERE b.id_uzytkownika IS NULL");


    $stmt->execute();
    $tickets = $stmt->fetchAll();

    echo json_encode($tickets);
} catch (\PDOException $e) {
    echo json_encode(["error" => "Failed to fetch market tickets: " . $e->getMessage()]);
}
?>