<?php
require 'Slim/Slim.php';
require 'country_db.php';
require 'database.php';
use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();
$app->get('/countries', 'getCountries');
$app->get('/countries/:id', 'getCountry');
$app->get('/countries/search/:query', 'findByName');
$app->post('/countries', 'addCountry');
$app->delete('/countries/:id', 'deleteCountry');
$app->put('/countries/:id', 'updateCountry');

$app->run();
?>