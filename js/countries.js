/**
 * Countries Management JavaScript File
 * Handles all country-related operations including CRUD operations, search, and UI interactions
 */

// Base API URL for country operations
var countriesRootURL = "http://localhost/countries-rest-api/api/countries"

/**
 * Retrieve all coountries from the API and display them in the table
 */
var findAllCountries = function() {
	console.log('findAllCountries');
	$.ajax({
		type: 'GET',
		url: countriesRootURL,
		dataType: "json",
		success: renderList
	});
};

/**
 * Find a specific country by ID and display its details
 * @param {number} id The country ID to retrieve 
 */
var findCountryById = function(id) {
    console.log('findCountryById: ' + id);
    $.ajax({
        type: 'GET',
        url: countriesRootURL + '/' + id,
        dataType: "json",
        success: function(data){
            console.log('findCountryById success:', data);

            var country = data.country;
            renderDetails(country);
        }
    });
};

/**
 * Render the list of countries in the data table
 * @param {Object} data Response data containing countries array
 */
var renderList = function(data) {
    console.log("DATA RECEIVED:", data);
	list=data.countries;
    console.log("response");

    // Loop through each country and add to table
	$.each(list, function(index, country) {
		$('#countries_table_body').append('<tr><td>'+country.name+'</td><td>'+
				country.capital+'</td><td>'+country.region+'</td><td>'+country.population+
				'</td><td>'+country.area+'</td><td>'+country.language+
                '</td><td>'+country.currency+'</td><td>'+country.gdp+
                '</td><td><img src="'+country.flag_url+'" alt="'+country.name+' flag" style="width: 50px; height: auto;"></td><td id="'
                +country.id+'"><a href="#">Show Description</a></td></tr>');
	});

    // Initialise DataTable with configuration
    var table = $('#countries_table_id').DataTable({
        searching: false,
        paging: true,
        ordering: true,
        autoWidth: false
    });
};

/**
 * Render country details in a modal dialog
 * @param {Object} country 
 */
var renderDetails=function(country) {
    var modal = '<h4><strong>'+ country.name + '\'s</strong> Description</h4>';
    var htmlStr='<p>'+country.description+'<br><hr>';
    $("#countrysName").html(modal);
    $("#contents").html(htmlStr);
    $('#descriptionModal').modal('show');
};

/**
 * Search for countries by name using the API
 * Triggers on keyup with minimum 2 characters
 */
var searchByName = function() {
    var query = $("#searchCountryName").val().trim();
    console.log('searchByName:', query);
    
    // Only search if there is at least 2 characters
    if (query.length >= 2) {
        $.ajax({
            type: 'GET',
            url: countriesRootURL + '/search/' + encodeURIComponent(query),
            dataType: "json",
            success: function(data) {
                console.log('searchByName response:', data);
                handleCountrySearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByRegion error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (query.length === 0) {
        // If search field is empty, reload all countries
        reloadAllCountries();
    }
};

/**
 * Search for countries by region using the API
 * Triggers on keyup with minimum 2 characters
 */
var searchByRegion = function() {
    var region = $("#searchCountryRegion").val().trim();
    console.log('searchByRegion:', region);
    
    // Only search if there is at least 2 characters
    if (region.length >= 2) {
        $.ajax({
            type: 'GET',
            url: countriesRootURL + '/region/' + encodeURIComponent(region),
            dataType: "json",
            success: function(data) {
                console.log('searchByRegion response:', data);
                handleCountrySearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByRegion error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (region.length === 0) {
        // If search field is empty, reload all countries
        reloadAllCountries();
    }
};

/**
 * Search for countries by capital using the API
 * Triggers on keyup with minimum 2 characters
 */
var searchByCapital = function() {
    var capital = $("#searchCountryCapital").val().trim();
    console.log('searchByCapital:', capital);
    
    // Only search if there is at least 2 characters
    if (capital.length >= 2) {
        $.ajax({
            type: 'GET',
            url: countriesRootURL + '/capital/' + encodeURIComponent(capital),
            dataType: "json",
            success: function(data) {
                console.log('searchByCapital response:', data);
                handleCountrySearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByCapital error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (capital.length === 0) {
        // If search field is empty, reload all countries
        reloadAllCountries();
    }
};

/**
 * Search for countries by language using the API
 * Triggers on keyup with minimum 2 characters
 */
var searchByLanguage = function() {
    var language = $("#searchCountryLanguage").val().trim();
    console.log('searchByLanguage:', language);
    
    // Only search if there is at least 2 characters
    if (language.length >= 2) {
        $.ajax({
            type: 'GET',
            url: countriesRootURL + '/language/' + encodeURIComponent(language),
            dataType: "json",
            success: function(data) {
                console.log('searchByLanguage response:', data);
                handleCountrySearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByLanguage error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (language.length === 0) {
        // If search field is empty, reload all countries
        reloadAllCountries();
    }
};

/**
 * Handle the response from country search and update the table
 * @param {Object} data Search response data
 */
var handleCountrySearchResponse = function(data) {
    console.log('handleCountrySearchResponse data:', data);
    
    // Clear existing DataTable and content
    if ($.fn.DataTable.isDataTable('#countries_table_id')) {
        $('#countries_table_id').DataTable().destroy();
    }
    $('#countries_table_body').empty();
    
    // Extract countries array from response
    var countriesArray = [];
    if (data.success && data.countries) {
        countriesArray = Array.isArray(data.countries) ? data.countries : [data.countries];
    }
    
    console.log('Countries to render:', countriesArray.length);

    // Handle empty results
    if (countriesArray.length === 0) {
        $('#countries_table_body').html('<tr><td colspan="10" class="text-center">' + (data.message || 'No countries found') + '</td></tr>');
        
        $('#countries_table_id').DataTable({
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            autoWidth: false
        });
    } else {
        // Render each country in the table
        $.each(countriesArray, function(index, country) {
            if (country && country.id) {
                $('#countries_table_body').append(
                    '<tr>' +
                    '<td>' + (country.name || '') + '</td>' +
                    '<td>' + (country.capital || '') + '</td>' +
                    '<td>' + (country.region || '') + '</td>' +
                    '<td>' + (country.population || '') + '</td>' +
                    '<td>' + (country.area || '') + '</td>' +
                    '<td>' + (country.language || '') + '</td>' +
                    '<td>' + (country.currency || '') + '</td>' +
                    '<td>' + (country.gdp || '') + '</td>' +
                    '<td>' + (country.flag_url || '') + '</td>' +
                    '<td id="' + country.id + '"><a href="#">More Info</a></td>' +
                    '</tr>'
                );
            }
        });
        
        // Reinitialise DataTable
        $('#countries_table_id').DataTable( {
            searching: false,
            paging: true,
            ordering: true,
            autoWidth: false
        });
    }
};

/**
 * Reload all countries by clearing table and fetching fresh data
 */
var reloadAllCountries = function() {
    if ($.fn.DataTable.isDataTable('#countries_table_id')) {
        $('#countries_table_id').DataTable().destroy();
    }
    $('#countries_table_body').empty();
    findAllCountries();
};

/**
 * Display error message in the countries table
 * @param {string} message Error message to display
 */
var showError = function(message) {
    if ($.fn.DataTable.isDataTable('#countries_table_id')) {
        $('#countries_table_id').DataTable().destroy();
    }
    $('#countries_table_body').html('<tr><td colspan="10">' + message + '</td></tr>');
    $('#countries_table_id').DataTable({
        searching: false,
        paging: true,
        ordering: true,
        info: false,
        autoWidth: false
    });
};

/**
 * Add a new country via API
 * Validates form data before submission including URL and numeric fields
 * @returns {void}
 */
var addCountry = function() {
    console.log("addCountry function called");
    
    // Collect form data
    var countryData = {
        name: $("#countryName").val(),
        capital: $("#countryCapital").val(),
        region: $("#countryRegion").val(),
        population: $("#countryPopulation").val(),
        area: $("#countryArea").val(),
        language: $("#countryLanguage").val(),
        currency: $("#countryCurrency").val(),
        gdp: $("#countryGDP").val(),
        flag_url: $("#countryFlag").val(),
        description: $("#countryDescription").val()
    };

    console.log("Country data to be sent:", countryData);

    // Validate all fields are filled
    for (var key in countryData) {
        if (!countryData[key]) {
            alert("Please fill in all fields! Missing: " + key);
            return false;
        }
    }

    // Validate flag URL format
    if (!isValidUrl(countryData.flag_url)) {
        alert("Please enter a valid URL for the flag (e.g., https://flagcdn.com/CHANGETHIS.svg)");
        return false;
    }

    // Validate numeric fields
    var numericFields = ['population', 'area', 'gdp'];
    for (var i = 0; i < numericFields.length; i++) {
        var field = numericFields[i];
        if (isNaN(countryData[field]) || countryData[field] <= 0) {
            alert("Please enter a valid positive number for " + field);
            return false;
        }
    }

    // Submit new country to API
    $.ajax({
        type: 'POST',
        url: countriesRootURL,
        data: JSON.stringify(countryData),
        contentType: 'application/json',
        dataType: "json",
        success: function(data) {
            console.log('Country added successfully:', data);
            $('#addCountryModal').modal('hide');
            $('#addCountryForm')[0].reset();
            reloadAllCountries();
            alert("Country added successfully!");
        },
        error: function(xhr, status, error) {
            console.log('Add country error:', xhr.responseText);
            alert("Error adding country: " + xhr.responseText);
        }
    });
};

/**
 * Load country data for updating by searching with country name
 * Enables the update form if country is found
 * @returns {void}
 */
var loadCountryForUpdate = function() {
    var countryName = $("#updateCountryName").val().trim();
    
    if (!countryName) {
        return;
    }

    console.log("Loading country data for:", countryName);

    // Search for country by name
    $.ajax({
        type: 'GET',
        url: countriesRootURL + '/search/' + encodeURIComponent(countryName),
        dataType: "json",
        success: function(searchData) {
            if (!searchData.success || !searchData.countries) {
                $("#countryFoundAlert").hide();
                $("#countryNotFoundAlert").show();
                disableUpdateForm();
                return;
            }

            // Extract country data (handle both array and single object responses)
            var country = searchData.countries;
            if (Array.isArray(country)) {
                country = country[0];
            }

            // Populate form fields with country data
            $("#updateName").val(country.name || '');
            $("#updateCapital").val(country.capital || '');
            $("#updateRegion").val(country.region || '');
            $("#updatePopulation").val(country.population || '');
            $("#updateArea").val(country.area || '');
            $("#updateLanguage").val(country.language || '');
            $("#updateCurrency").val(country.currency || '');
            $("#updateGDP").val(country.gdp || '');
            $("#updateFlag").val(country.flag_url || '');
            $("#updateDescription").val(country.description || '');

            // Store country ID for the update operation
            $("#updateCountryForm").data('countryId', country.id);

            // Show success and enable form
            $("#countryNotFoundAlert").hide();
            $("#countryFoundAlert").show();
            enableUpdateForm();
        },
        error: function(xhr, status, error) {
            $("#countryFoundAlert").hide();
            $("#countryNotFoundAlert").show();
            disableUpdateForm();
        }
    });
};

/**
 * Enable the country update form fields and submit button
 */
var enableUpdateForm = function() {
    $("#updateName").prop('disabled', false);
    $("#updateCapital").prop('disabled', false);
    $("#updateRegion").prop('disabled', false);
    $("#updatePopulation").prop('disabled', false);
    $("#updateArea").prop('disabled', false);
    $("#updateLanguage").prop('disabled', false);
    $("#updateCurrency").prop('disabled', false);
    $("#updateGDP").prop('disabled', false);
    $("#updateFlag").prop('disabled', false);
    $("#updateDescription").prop('disabled', false);
    $("#btnConfirmUpdate").prop('disabled', false);
};

/**
 * Disable the country update form fields and submit button
 */
var disableUpdateForm = function() {
    $("#updateName").prop('disabled', true).val('');
    $("#updateCapital").prop('disabled', true).val('');
    $("#updateRegion").prop('disabled', true).val('');
    $("#updatePopulation").prop('disabled', true).val('');
    $("#updateArea").prop('disabled', true).val('');
    $("#updateLanguage").prop('disabled', true).val('');
    $("#updateCurrency").prop('disabled', true).val('');
    $("#updateGDP").prop('disabled', true).val('');
    $("#updateFlag").prop('disabled', true).val('');
    $("#updateDescription").prop('disabled', true).val('');
    $("#btnConfirmUpdate").prop('disabled', true);
};

/**
 * Update an existing country with modified data
 * Validates all fields before submission
 * @returns {void}
 */
var updateCountry = function() {
    console.log("updateCountry function called");
    
    var countryId = $("#updateCountryForm").data('countryId');
    var originalName = $("#updateCountryForm").data('originalName');
    var newName = $("#updateName").val().trim();
    
    // Validate that there is a country loaded
    if (!countryId) {
        alert("Please first load a country by entering its name!");
        return false;
    }

    // Collect updated country data
    var updatedData = {
        name: newName,
        capital: $("#updateCapital").val(),
        region: $("#updateRegion").val(),
        population: $("#updatePopulation").val(),
        area: $("#updateArea").val(),
        language: $("#updateLanguage").val(),
        currency: $("#updateCurrency").val(),
        gdp: $("#updateGDP").val(),
        flag_url: $("#updateFlag").val(),
        description: $("#updateDescription").val()
    };

    console.log("Update data:", updatedData);

    // Validate all fields are filled
    for (var key in updatedData) {
        if (!updatedData[key]) {
            alert("Please fill in all fields! Missing: " + key);
            return false;
        }
    }

    // Validate flag URL format
    if (!isValidUrl(updatedData.flag_url)) {
        alert("Please enter a valid URL for the flag");
        return false;
    }

    // Submit update to API
    $.ajax({
        type: 'PUT',
        url: countriesRootURL + '/' + countryId,
        data: JSON.stringify(updatedData),
        contentType: 'application/json',
        dataType: "json",
        success: function(data) {
            console.log('Country updated successfully:', data);
            $('#updateCountryModal').modal('hide');
            $('#updateCountryForm')[0].reset();
            $("#updateCountryForm").removeData('countryId');
            disableUpdateForm();
            $("#countryFoundAlert").hide();
            $("#countryNotFoundAlert").hide();
            reloadAllCountries();
            alert("Country updated successfully!");
        },
        error: function(xhr, status, error) {
            console.log('Update country error:', xhr.responseText);
            alert("Error updating country: " + xhr.responseText);
        }
    });
};

/**
 * Delete a country after confirmation
 * First searches for country, then deletes if found
 * @returns {void}
 */
var deleteCountry = function() {
    console.log("deleteCountry function called");
    
    var countryName = $("#deleteCountryName").val().trim();
    
    if (!countryName) {
        alert("Please enter a country name to delete!");
        return false;
    }

    // First search for the country to get its ID
    $.ajax({
        type: 'GET',
        url: countriesRootURL + '/search/' + encodeURIComponent(countryName),
        dataType: "json",
        success: function(searchData) {
            if (!searchData.success || !searchData.countries) {
                alert("Country not found! Please check the name and try again.");
                return;
            }

            // Extract country data
            var country = searchData.countries;
            if (Array.isArray(country)) {
                country = country[0];
            }

            var countryId = country.id;
            
            // Confirm deletion with user
            if (confirm("Are you sure you want to delete " + countryName + "? This action cannot be undone.")) {
                // Proceed with deletion
                $.ajax({
                    type: 'DELETE',
                    url: countriesRootURL + '/' + countryId,
                    dataType: "json",
                    success: function(data) {
                        console.log('Country deleted successfully:', data);
                        $('#deleteCountryModal').modal('hide');
                        $('#deleteCountryForm')[0].reset();
                        reloadAllCountries();
                        alert("Country deleted successfully!");
                    },
                    error: function(xhr, status, error) {
                        console.log('Delete country error:', xhr.responseText);
                        alert("Error deleting country: " + xhr.responseText);
                    }
                });
            }
        },
        error: function(xhr, status, error) {
            alert("Error finding country: " + error);
        }
    });
};

/**
 * Validate if a string is a properly formatted URL
 * @param {string} string The URL string to validate
 * @returns {boolean} True if valid URL, false otherwise
 */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Document ready function - initialises all event handlers and loads initial data
 */
$(document).ready(function() {
    // Load all countries on page load
    findAllCountries();
    
    // Set up click handler for country description links
    $(document).on("click", '#countries_table_body td', function() {
        findCountryById(this.id);
    });

    // Search funtionality handlers
    $("#searchCountryName").on("keyup", function() { searchByName(); });
    $("#searchCountryRegion").on("keyup", function() { searchByRegion(); });
    $("#searchCountryCapital").on("keyup", function() { searchByCapital(); });
    $("#searchCountryLanguage").on("keyup", function() { searchByLanguage(); });

    // Add Country modal handlers
    $("#addCountryButton").on("click", function() {
        $('#addCountryModal').modal('show');
    });

    $("#btnConfirmAdd").on("click", function() {
        addCountry();
    });

    // Update Country modal handlers
    $("#updateCountryButton").on("click", function() {
        $('#updateCountryModal').modal('show');
        disableUpdateForm();
        $("#countryFoundAlert").hide();
        $("#countryNotFoundAlert").hide();
    });

    $("#updateCountryName").on("keypress", function(e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            loadCountryForUpdate();
        }
    });

    $("#updateCountryName").on("blur", function() {
        loadCountryForUpdate();
    });

    $("#btnConfirmUpdate").on("click", function() {
        updateCountry();
    });

    // Delete Country modal handlers
    $("#deleteCountryButton").on("click", function() {
        $('#deleteCountryModal').modal('show');
    });

    $("#btnConfirmDelete").on("click", function() {
        deleteCountry();
    });

    // Modal clenaup handlers
    $('#addCountryModal').on('hidden.bs.modal', function () {
        $('#addCountryForm')[0].reset();
    });

    $('#updateCountryModal').on('hidden.bs.modal', function () {
        $('#updateCountryForm')[0].reset();
        $("#updateCountryForm").removeData('countryId');
        $("#updateCountryForm").removeData('originalName');
        disableUpdateForm();
        $("#countryFoundAlert").hide();
        $("#countryNotFoundAlert").hide();
    });

    $('#deleteCountryModal').on('hidden.bs.modal', function () {
        $('#deleteCountryForm')[0].reset();
    });

    // Prevent form submission on Enter key in delete country modal
    $("#deleteCountryName").on("keypress", function(e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            deleteCountry();
        }
    });

    // Also prevent the default form submission
    $("#deleteCountryForm").on("submit", function(e) {
        e.preventDefault();
    });
});