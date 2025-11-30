<?php
// Database connection configuration
$dsn = 'mysql:host=localhost:3306;dbname=world_data';
$username = 'root';
$password = '';

// Database connection using PDO with error handling
try {
    $db = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    $error_message = $e->getMessage();
    exit();
}
?>