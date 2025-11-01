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
    // Pobranie id_lekarza na podstawie tokenu autoryzacyjnego lekarza
    $sqlOrganizerId = "SELECT id_organizatora FROM organizatorzy WHERE token_sesji = '$authToken'";
    $resultOrganizerId = $conn->query($sqlOrganizerId);

    if ($resultOrganizerId->num_rows > 0) {
        $organizerData = $resultOrganizerId->fetch_assoc();
        $organizerId = $organizerData['id_organizatora'];

        // Pobranie wizyt lekarza na podstawie id_lekarza
        $sqlEvents = "SELECT id_wydarzenia, typ, nazwa, data, godzina, miasto, adres, opis
                      FROM wydarzenia
                      WHERE id_organizatora = '$organizerId'";

//        $sqlVisits = "SELECT w.*, u.imie AS imie_uzytkownika, u.nazwisko AS nazwisko_uzytkownika
 //                                     FROM wizyty w
   //                                   INNER JOIN uzytkownicy u ON w.id_uzytkownika = u.id_uzytkownika
      //                                WHERE w.id_lekarza = '$doctorId'";

        $resultEvents = $conn->query($sqlEvents);

        $eventsData = array(); // Inicjalizacja tablicy na dane wizyt

        if ($resultEvents->num_rows > 0) {
            while ($row = $resultEvents->fetch_assoc()) {
                $events = array(
                    'id_wydarzenia' => $row['id_wydarzenia'],
                    'typ' => $row['typ'],
                    'nazwa' => $row['nazwa'],
                    'data' => $row['data'],
                    'miasto' => $row['miasto'],
                    'adres' => $row['adres'],
                    'godzina' => $row['godzina'],
                    'opis' => $row['opis'],
                );
                $eventsData[] = $events;
            }
            // Zwrócenie danych w formacie JSON
            echo json_encode($eventsData);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Brak wizyt dla tego lekarza']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Nie znaleziono lekarza']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Brak wymaganego tokenu autoryzacyjnego lekarza']);
}

$conn->close();
?>

