<?php
    $dsn = 'mysql:host=localhost:3306;dbname=world_data';
    $username = 'root';
    $password = '';

    try {
        $db = new PDO($dsn, $username, $password);
    } catch (PDOException $e) {
        $error_message = $e->getMessage();
        //include('database_error.php');
        exit();
    }
?>