<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Odczytaj dane z żądania
$data = json_decode(file_get_contents('php://input'), true);

$primaryColor = $data['primaryColor'] ?? null;
$secondaryColor = $data['secondaryColor'] ?? null;
$textColor = $data['textColor'] ?? null;
$cssFilePath = 'C:\Users\pswie\OneDrive\Pulpit\PZ\my-app\src\App.css';


if ($primaryColor !== null && $secondaryColor !== null && $textColor !== null) {

    $cssContent = file_get_contents($cssFilePath);

  // Zmiana kolorów w zawartości pliku
  $cssContent = preg_replace('/--primary-color:\s*#[0-9a-fA-F]{6};/', '--primary-color: ' . $primaryColor . ';', $cssContent);
    $cssContent = preg_replace('/--secondary-color:\s*#[0-9a-fA-F]{6};/', '--secondary-color: ' . $secondaryColor . ';', $cssContent);
    $cssContent = preg_replace('/--text-color:\s*#[0-9a-fA-F]{6};/', '--text-color: ' . $textColor . ';', $cssContent);



    // Zapisz zmienioną zawartość z powrotem do pliku
    if (file_put_contents($cssFilePath, $cssContent) !== false) {
         echo json_encode(['message' => 'Colors updated successfully']);
      } else {
        echo json_encode(['error' => 'Error writing to file.']);
      }

  } else {
     echo json_encode(['error' => 'Invalid data provided.']);
  }

?>