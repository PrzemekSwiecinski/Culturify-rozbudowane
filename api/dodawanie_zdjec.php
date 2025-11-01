<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "culturify";
$upload_dir = "C:\Users\pswie\OneDrive\Pulpit\PZ\my-app\public\assets/";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Błąd połączenia z bazą danych']));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image']) && isset($_POST['description'])) {
    $description = $_POST['description'];
    $image = $_FILES['image'];

    if (empty($description) || $image['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Brakujące dane lub błąd podczas uploadu zdjęcia.']);
        $conn->close();
        exit;
    }

    $originalImageName = basename($image['name']); // Oryginalna nazwa pliku
    $target_file = $upload_dir . $originalImageName; // Ścieżka z oryginalną nazwą

     $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        http_response_code(400);
        echo json_encode(['error' => 'Nieprawidłowy format pliku.']);
        $conn->close();
        exit;
    }

    if (file_exists($target_file)) {
         http_response_code(400);
         echo json_encode(['error' => 'Plik o tej nazwie już istnieje.']);
          $conn->close();
        exit;
    }


    if (move_uploaded_file($image['tmp_name'], $target_file)) {
        $sql = "INSERT INTO galeria (sciezka, tekst, nazwa) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Błąd podczas przygotowywania zapytania SQL.']);
            $conn->close();
            exit;
        }

        $stmt->bind_param("sss", $target_file, $description, $originalImageName);

         if ($stmt->execute()) {
          http_response_code(200);
             echo json_encode(['success' => 'Zdjęcie dodane pomyślnie.']);
         } else {
             http_response_code(500);
             echo json_encode(['error' => 'Błąd podczas dodawania zdjęcia do bazy danych.']);
        }

          $stmt->close();

    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Błąd podczas uploadu pliku.']);
    }


} else {
    http_response_code(400);
    echo json_encode(['error' => 'Nieprawidłowe dane wejściowe.']);
}

$conn->close();
?>