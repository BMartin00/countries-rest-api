<?php
/**
 * COUNTRY RELATED FUNCTIONS
 */

/**
 * Retrive all countries with optional sorting
 *
 * @return void JSON response
 */
function getCountries() {
	// Check if parameter is provided, default to name
	if (isset($_GET['sort'])) {
		$col = $_GET['sort'];
	} else {
		$col = "name";
	}

	$query = "SELECT * FROM countries ORDER BY "."$col";

	try {
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		echo json_encode([
			"success" => true,
			"message" => "Countries retrieved successfully.",
			"countries" => $countries
		]);
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Retrieve a specific country by ID
 *
 * @param int $id Country ID
 * @return void JSON response
 */
function getCountry($id) {
	$query = "SELECT * FROM countries WHERE id = '$id'";

	try {
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetch(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries) {
			echo json_encode([
				"success" => true,
				"message" => "Country retrieved successfully.",
				"country" => $countries
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No country found with ID $id."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Search countries by name using partial matching
 *
 * @param string $name Country name or partial name
 * @return void JSON response
 */
function findByName($name) {
	$query = "SELECT * FROM countries WHERE UPPER(name) LIKE " . '"%' . $name . '%"' . " ORDER BY name";

	try {
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries) {
			echo json_encode([
				"success" => true,
				"message" => "Country search successful.",
				"countries" => $countries
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No countries found matching '$name'."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Get countries by region using partial matching with optional sorting
 *
 * @param string $region Region name or partial region name
 * @return void JSON response
 */
function getCountriesByRegion($region) {
	// Check if parameter is provided, default to name
	if (isset($_GET['sort'])) {
		$col = $_GET['sort'];
	} else {
		$col = "name";
	}

	$query = "SELECT * FROM countries WHERE UPPER(region) LIKE " . '"%' . $region . '%"' . " ORDER BY $col";

	try {
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries) {
			echo json_encode([
				"success" => true,
				"message" => "Region search successful.",
				"countries" => $countries
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No region found matching '$region'."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Search countries by name using partial matching
 *
 * @param string $capital Capital city name or partial capital city name
 * @return void JSON response
 */
function getCountriesByCapital($capital) {
	$query = "SELECT * FROM countries WHERE UPPER(capital) LIKE " . '"%' . $capital . '%"' . " ORDER BY capital";

	try {
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries) {
			echo json_encode([
				"success" => true,
				"message" => "Capital search successful.",
				"countries" => $countries
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No capital found matching '$capital'."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Get countries by language using partial matching with optional sorting
 *
 * @param string $language Language name or partial language name
 * @return void JSON response
 */
function getCountriesByLanguage($language) {
	// Check if parameter is provided, default to name
	if (isset($_GET['sort'])) {
		$col = $_GET['sort'];
	} else {
		$col = "name";
	}

	$query = "SELECT * FROM countries WHERE UPPER(language) LIKE " . '"%' . $language . '%"' . " ORDER BY $col";

	try {
		global $db;
		$countries = $db->query($query);
		$countries = $countries->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($countries) {
			echo json_encode([
				"success" => true,
				"message" => "Language search successful.",
				"countries" => $countries
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No language found matching '$language'."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Add a new country to the database
 *
 * @return void JSON response
 */
function addCountry() {
	global $app;
	$request = $app->request();
	$country = json_decode($request->getBody());

	// Validate JSON input
	if (!$country) {
		echo json_encode([
			"success" => false,
			"message" => "Invalid JSON format."
		]);
		return;
	}

	// Check all required fields are present and not empty
	$requiredFields = ['name', 'capital', 'region', 'population', 'area', 'language', 'currency', 'gdp', 'description', 'flag_url'];
	foreach ($requiredFields as $field) {
		if (!property_exists($country, $field) || $country->$field === '' || $country->$field === null) {
			echo json_encode([
				"success" => false,
				"message" => "Missing or empty field: '$field'. All fields are required."
			]);
			return;
		}
	}

	// Validate numeric fields
	$numericFields = ['population', 'area', 'gdp'];
	foreach ($numericFields as $field) {
		if (!is_numeric($country->$field)) {
			echo json_encode([
				"success" => false,
				"message" => ucfirst($field) . " must be a number."
			]);
			return;
		}
	}

	// Extract country data
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
	try {
		global $db;
		$db->exec($query);
		$country->id = $db->lastInsertId();
		echo json_encode([
			"success" => true,
			"message" => "Country added successfully.",
			"country" => $country
		]);
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Delete a country by ID
 *
 * @param int $id Country ID to delete
 * @return void JSON response
 */
function deleteCountry($id) {
	$query = "DELETE FROM countries WHERE id=$id";
	try {
		global $db;
		$rowsAffected = $db->exec($query);
		if ($rowsAffected > 0) {
			echo json_encode([
				"success" => true,
				"message" => "Country deleted successfully."
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No country found with ID $id."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Update an existing country
 *
 * @param int $id Country ID to update
 * @return void JSON response
 */
function updateCountry($id) {
	global $app;
	$request = $app->request();
	$country = json_decode($request->getBody());

	// Validate JSON input
	if (!$country) {
		echo json_encode([
			"success" => false,
			"message" => "Invalid JSON format."
		]);
		return;
	}

	// Check all required fields are present and not empty
	$requiredFields = ['name', 'capital', 'region', 'population', 'area', 'language', 'currency', 'gdp', 'description', 'flag_url'];
	foreach ($requiredFields as $field) {
		if (!property_exists($country, $field) || $country->$field === '' || $country->$field === null) {
			echo json_encode([
				"success" => false,
				"message" => "Missing or empty field: '$field'. All fields are required."
			]);
			return;
		}
	}

	// Validate numeric fields
	$numericFields = ['population', 'area', 'gdp'];
	foreach ($numericFields as $field) {
		if (!is_numeric($country->$field)) {
			echo json_encode([
				"success" => false,
				"message" => ucfirst($field) . " must be a number."
			]);
			return;
		}
	}

	// Extract country data
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

	try {
		global $db;
		$rowsAffected = $db->exec($query);
		if ($rowsAffected > 0) {
			echo json_encode([
				"success" => true,
				"message" => "Country updated successfully.",
				"country" => $country
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No country found with ID $id or no changes made."
			]);
		}
	} catch (PDOException $e) {
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}


/**
 * USER RELATED FUNCTIONS
 */


/**
 * Retrieve all users with optional sorting
 *
 * @return void JSON response
 */
function getUsers() {
	// Check if parameter is provided, default to name
	if (isset($_GET['sort'])) {
		$col = $_GET['sort'];
	} else {
		$col = "name";
	}

	$query = "SELECT * FROM users ORDER BY "."$col";

	try {
		global $db;
		$users = $db->query($query);
		$users = $users->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		echo json_encode([
			"success" => true,
			"message" => "Users retrieved successfully.",
			"users" => $users
		]);
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Retrieve a specific user by ID
 *
 * @param int $id User ID
 * @return void JSON response
 */
function getUser($id) {
	$query = "SELECT * FROM users WHERE id = '$id'";

	try {
		global $db;
		$users = $db->query($query);
		$users = $users->fetch(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($users) {
			echo json_encode([
				"success" => true,
				"message" => "User retrieved successfully.",
				"country" => $users
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No user found with ID $id."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Search users by username using partial matching
 *
 * @param string $username Username or partial username
 * @return void JSON response
 */
function searchByUsername($username) {
	$query = "SELECT * FROM users WHERE UPPER(username) LIKE " . '"%' . $username . '%"' . " ORDER BY username";

	try {
		global $db;
		$users = $db->query($query);
		$users = $users->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		if ($users) {
			echo json_encode([
				"success" => true,
				"message" => "Username search successful.",
				"users" => $users
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No username found matching '$username'."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Add a new user to the database
 *
 * @return void JSON response
 */
function addUser() {
	global $app;
	$request = $app->request();
	$user = json_decode($request->getBody());

	// Validate JSON input
	if (!$user) {
		echo json_encode([
			"success" => false,
			"message" => "Invalid JSON format."
		]);
		return;
	}

	// Check all required fields are present and not empty
	$requiredFields = ['name', 'username', 'password', 'image'];
	foreach ($requiredFields as $field) {
		if (!property_exists($user, $field) || $user->$field === '' || $user->$field === null) {
			echo json_encode([
				"success" => false,
				"message" => "Missing or empty field: '$field'. All fields are required."
			]);
			return;
		}
	}

	// Extract user data
	$name = $user->name;
	$username = $user->username;
	$password = $user->password;
	$image = $user->image;

	$query = "INSERT INTO users 
				(name, username, password, image) 
			VALUES 
				('$name', '$username', '$password', '$image')";
	try {
		global $db;
		$db->exec($query);
		$user->id = $db->lastInsertId();
		echo json_encode([
			"success" => true,
			"message" => "User added successfully.",
			"user" => $user
		]);
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Delete a user by ID
 *
 * @param int $id User ID to delete
 * @return void JSON response
 */
function deleteUser($id) {
	$query = "DELETE FROM users WHERE id=$id";
	try
	{
		global $db;
		$rowsAffected = $db->exec($query);
		if ($rowsAffected > 0)
		{
			echo json_encode([
				"success" => true,
				"message" => "User deleted successfully."
			]);
		}
		else
		{
			echo json_encode([
				"success" => false,
				"message" => "No user found with ID $id."
			]);
		}
	} catch (PDOException $e) {
		echo json_encode(["error" => ["text" => $e->getMessage()]]);
	}
}

/**
 * Update an existing user
 *
 * @param int $id User ID to update
 * @return void JSON response
 */
function updateUser($id) {
	global $app;
	$request = $app->request();
	$user = json_decode($request->getBody());

	// Validate JSON input
	if (!$user) {
		echo json_encode([
			"success" => false,
			"message" => "Invalid JSON format."
		]);
		return;
	}

	// Check all required fields are present and not empty
	$requiredFields = ['name', 'username', 'password', 'image'];
	foreach ($requiredFields as $field) {
		if (!property_exists($user, $field) || $user->$field === '' || $user->$field === null) {
			echo json_encode([
				"success" => false,
				"message" => "Missing or empty field: '$field'. All fields are required."
			]);
			return;
		}
	}

	// Extract user data
	$name = $user->name;
	$username = $user->username;
	$password = $user->password;
	$image = $user->image;

	$query = "UPDATE users SET name='$name', username='$username', password='$password', 
			image ='$image' WHERE id='$id'";

	try {
		global $db;
		$rowsAffected = $db->exec($query);
		if ($rowsAffected > 0) {
			echo json_encode([
				"success" => true,
				"message" => "User updated successfully.",
				"user" => $user
			]);
		} else {
			echo json_encode([
				"success" => false,
				"message" => "No user found with ID $id or no changes made."
			]);
		}
	} catch (PDOException $e) {
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}
?>