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
$app->get('/countries/region/:region', 'getCountriesByRegion');
$app->get('/countries/capital/:capital', 'getCountriesByCapital');
$app->get('/countries/language/:language', 'getCountriesByLanguage');
$app->post('/countries', 'addCountry');
$app->delete('/countries/:id', 'deleteCountry');
$app->put('/countries/:id', 'updateCountry');

$app->get('/users', 'getUsers');
$app->get('/users/:id', 'getUser');
$app->get('/users/search/:query', 'searchByName');
$app->post('/users', 'addUser');
$app->delete('/users/:id', 'deleteUser');
$app->put('/users/:id', 'updateUser');

$app->run();
?>