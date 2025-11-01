<?php
header("Access-Control-Allow-Origin: *"); // Lub inny adres Reacta
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");
session_start(); // Start the session

// Zniszcz sesję
session_unset();
session_destroy();

echo json_encode(['message' => 'Wylogowano pomyślnie']);
?>