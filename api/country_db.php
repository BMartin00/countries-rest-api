<?php
function getCountries()
{
	if (isset($_GET['sort']))
	{
		$col = $_GET['sort'];
	}
	else
	{
		$col = "name";
	}

	$query = "SELECT * FROM countries ORDER BY "."$col";

	try
	{
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		echo '{"countries":' . json_encode($countries) . '}';
	}
	catch (PDOException $e)
	{
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}

function getCountry($id)
{
	$query = "SELECT * FROM countries WHERE id = '$id'";

	try
	{
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetch(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		echo json_encode($countries);
	}
	catch (PDOException $e)
	{
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}

function findByName($name)
{
	$query = "SELECT * FROM countries WHERE UPPER(name) LIKE " . '"%' . $name . '%"' . " ORDER BY name";

	try
	{
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetch(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		echo json_encode($countries);
	}
	catch (PDOException $e)
	{
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}

function addCountry()
{
    global $app;
    $request = $app->request();
    $country = json_decode($request->getBody());
    $name = $country->name;
    $capital = $country->capital;
    $region = $country->region;
    $population = $country->population;
    $area = $country->area;
    $language = $country->language;
    $currency = $country->currency;
    $gdp = $country->gdp;
    $description = $country->description;
    $flag_url = $country->flag_url;
    $query = "INSERT INTO countries 
                (name, capital, region, population, area, language, currency, gdp, description, flag_url) 
            VALUES 
                ('$name', '$capital', '$region', '$population', '$area', '$language', '$currency', '$gdp', '$description', '$flag_url')";
    try
    {
        global $db;
        $db->exec($query);
        $country->id = $db->lastInsertId();
        echo json_encode($country);
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}

function deleteCountry($id)
{
    $query = "DELETE FROM countries WHERE id=$id";
    try
    {
        global $db;
        $db->exec($query);
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}

function updateCountry($id)
{
    global $app;
    $request = $app->request();
    $country = json_decode($request->getBody());
    $name = $country->name;
    $capital = $country->capital;
    $region = $country->region;
    $population = $country->population;
    $area = $country->area;
    $language = $country->language;
    $currency = $country->currency;
    $gdp = $country->gdp;
    $description = $country->description;
    $flag_url = $country->flag_url;
    $query = "UPDATE countries SET name='$name', capital='$capital', region='$region', 
            population ='$population', area='$area', language='$language', currency='$currency', 
            gdp='$gdp', description='$description', flag_url='$flag_url' WHERE id='$id'";
    try
    {
        global $db;
        $db->exec($query);
        echo json_encode($country);
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}
?>