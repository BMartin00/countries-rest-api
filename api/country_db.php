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
		echo json_encode([
			"success" => true,
			"message" => "Countries retrieved successfully.",
			"countries" => $countries
		]);
	}
	catch (PDOException $e)
	{
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
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
		if ($countries)
        {
			echo json_encode([
				"success" => true,
				"message" => "Country retrieved successfully.",
				"country" => $countries
			]);
		}
        else
        {
			echo json_encode([
				"success" => false,
				"message" => "No country found with ID $id."
			]);
		}
	}
	catch (PDOException $e)
	{
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
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
		if ($countries)
        {
			echo json_encode([
				"success" => true,
				"message" => "Country search successful.",
				"countries" => $countries
			]);
		}
        else
        {
			echo json_encode([
				"success" => false,
				"message" => "No countries found matching '$name'."
			]);
		}
	}
	catch (PDOException $e)
	{
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

function getCountriesByRegion($region)
{
    if (isset($_GET['sort']))
	{
		$col = $_GET['sort'];
	}
	else
	{
		$col = "name";
	}

	$query = "SELECT * FROM countries WHERE UPPER(region) LIKE " . '"%' . $region . '%"' . " ORDER BY $col";

	try
	{
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries)
        {
			echo json_encode([
				"success" => true,
				"message" => "Region search successful.",
				"countries" => $countries
			]);
		}
        else
        {
			echo json_encode([
				"success" => false,
				"message" => "No region found matching '$region'."
			]);
		}
	}
	catch (PDOException $e)
	{
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

function getCountriesByCapital($capital)
{
	$query = "SELECT * FROM countries WHERE UPPER(capital) LIKE " . '"%' . $capital . '%"' . " ORDER BY capital";

	try
	{
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetch(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries)
        {
			echo json_encode([
				"success" => true,
				"message" => "Capital search successful.",
				"countries" => $countries
			]);
		}
        else
        {
			echo json_encode([
				"success" => false,
				"message" => "No capital found matching '$capital'."
			]);
		}
	}
	catch (PDOException $e)
	{
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

function getCountriesByLanguage($language)
{
    if (isset($_GET['sort']))
	{
		$col = $_GET['sort'];
	}
	else
	{
		$col = "name";
	}
    
	$query = "SELECT * FROM countries WHERE UPPER(language) LIKE " . '"%' . $language . '%"' . " ORDER BY $col";

	try
	{
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries)
        {
			echo json_encode([
				"success" => true,
				"message" => "Language search successful.",
				"countries" => $countries
			]);
		}
        else
        {
			echo json_encode([
				"success" => false,
				"message" => "No Language found matching '$language'."
			]);
		}
	}
	catch (PDOException $e)
	{
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

function addCountry()
{
    global $app;
    $request = $app->request();
    $country = json_decode($request->getBody());

    if (!$country)
    {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON format."
        ]);
        return;
    }

    $requiredFields = ['name', 'capital', 'region', 'population', 'area', 'language', 'currency', 'gdp', 'description', 'flag_url'];
    foreach ($requiredFields as $field)
    {
        if (!property_exists($country, $field) || $country->$field === '' || $country->$field === null)
        {
            echo json_encode([
                "success" => false,
                "message" => "Missing or empty field: '$field'. All fields are required."
            ]);
            return;
        }
    }

    $numericFields = ['population', 'area', 'gdp'];
    foreach ($numericFields as $field)
    {
        if (!is_numeric($country->$field))
        {
            echo json_encode([
                "success" => false,
                "message" => ucfirst($field) . " must be a number."
            ]);
            return;
        }
    }

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
        echo json_encode([
			"success" => true,
			"message" => "Country added successfully.",
			"country" => $country
		]);
    }
    catch (PDOException $e)
    {
        echo json_encode(["error" => ["text" => $e->getMessage()]]);
    }
}

function deleteCountry($id)
{
    $query = "DELETE FROM countries WHERE id=$id";
    try
    {
        global $db;
        $rowsAffected = $db->exec($query);
        if ($rowsAffected > 0)
        {
			echo json_encode([
				"success" => true,
				"message" => "Country deleted successfully."
			]);
		}
        else
        {
			echo json_encode([
				"success" => false,
				"message" => "No country found with ID $id."
			]);
		}
    }
    catch (PDOException $e)
    {
        echo json_encode(["error" => ["text" => $e->getMessage()]]);
    }
}

function updateCountry($id)
{
    global $app;
    $request = $app->request();
    $country = json_decode($request->getBody());

    if (!$country)
    {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON format."
        ]);
        return;
    }
    
    $requiredFields = ['name', 'capital', 'region', 'population', 'area', 'language', 'currency', 'gdp', 'description', 'flag_url'];
    foreach ($requiredFields as $field)
    {
        if (!property_exists($country, $field) || $country->$field === '' || $country->$field === null)
        {
            echo json_encode([
                "success" => false,
                "message" => "Missing or empty field: '$field'. All fields are required."
            ]);
            return;
        }
    }

    $numericFields = ['population', 'area', 'gdp'];
    foreach ($numericFields as $field)
    {
        if (!is_numeric($country->$field))
        {
            echo json_encode([
                "success" => false,
                "message" => ucfirst($field) . " must be a number."
            ]);
            return;
        }
    }

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
        $rowsAffected = $db->exec($query);
		if ($rowsAffected > 0)
        {
			echo json_encode([
				"success" => true,
				"message" => "Country updated successfully.",
				"country" => $country
			]);
		}
        else
        {
			echo json_encode([
				"success" => false,
				"message" => "No country found with ID $id or no changes made."
			]);
		}
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}
?>