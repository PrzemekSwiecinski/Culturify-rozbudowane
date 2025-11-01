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

$sql = "SELECT primaryColor, secondaryColor, textColor FROM ustawienia_motywu WHERE id_ustawien = 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $primaryColor = $row['primaryColor'];
    $secondaryColor = $row['secondaryColor'];
    $textColor = $row['textColor'];

    // Funkcja do rozjaśniania koloru
    function lightenColor($hex, $percent) {
        $hex = str_replace('#', '', $hex);
        if (strlen($hex) == 3) {
            $hex = str_repeat(substr($hex, 0, 1), 2).str_repeat(substr($hex, 1, 1), 2).str_repeat(substr($hex, 2, 1), 2);
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        $r = min(255, max(0, $r + (255 - $r) * ($percent / 100)));
        $g = min(255, max(0, $g + (255 - $g) * ($percent / 100)));
        $b = min(255, max(0, $b + (255 - $b) * ($percent / 100)));

        return '#' . str_pad(dechex($r), 2, '0', STR_PAD_LEFT) . str_pad(dechex($g), 2, '0', STR_PAD_LEFT) . str_pad(dechex($b), 2, '0', STR_PAD_LEFT);

    }

    // Funkcja do przyciemniania koloru
      function darkenColor($hex, $percent) {
        $hex = str_replace('#', '', $hex);
        if (strlen($hex) == 3) {
           $hex = str_repeat(substr($hex, 0, 1), 2).str_repeat(substr($hex, 1, 1), 2).str_repeat(substr($hex, 2, 1), 2);
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

         $r = max(0, min(255, $r - ($r * ($percent / 100))));
        $g = max(0, min(255, $g - ($g * ($percent / 100))));
        $b = max(0, min(255, $b - ($b * ($percent / 100))));

        return '#' . str_pad(dechex($r), 2, '0', STR_PAD_LEFT) . str_pad(dechex($g), 2, '0', STR_PAD_LEFT) . str_pad(dechex($b), 2, '0', STR_PAD_LEFT);
    }
    $primaryColorLight = lightenColor($primaryColor, 10);
    $secondaryColorDark = darkenColor($secondaryColor, 10);

      $response = [
        'primaryColor' => $primaryColor,
        'secondaryColor' => $secondaryColor,
        'textColor' => $textColor,
          'primaryColorLight' => $primaryColorLight,
           'secondaryColorDark' => $secondaryColorDark,
    ];


    echo json_encode($response);
} else {
    echo json_encode([]);
}

$conn->close();
?>