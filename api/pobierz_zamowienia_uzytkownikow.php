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

$sql = "SELECT
            z.id_zamowienia,
            z.id_uzytkownika,
            z.cena,
            u.imie,
            u.nazwisko,
            u.email,
            u.telefon
        FROM zamowienia z
        INNER JOIN uzytkownicy u ON z.id_uzytkownika = u.id_uzytkownika";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $zamowienia = array();
    while ($row = $result->fetch_assoc()) {
        $zamowienia[] = $row;
    }
    echo json_encode($zamowienia);
} else {
    echo json_encode([]);
}

$conn->close();
?>