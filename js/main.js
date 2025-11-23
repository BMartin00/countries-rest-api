var rootURL = "http://localhost/countries-rest-api/api/countries"

var findAll = function(){
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json",
		success: renderList
	});
};

var findById = function(id){
    console.log('findById: ' + id);
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function(data){
            console.log('findById success:', data);

            var country = data.country;
            renderDetails(country);
        }
    });
};

var renderList = function(data) {
    console.log("DATA RECEIVED:", data);
	list=data.countries;
        console.log("response");
	$.each(list, function(index, country) {
		$('#countries_table_body').append('<tr><td>'+country.name+'</td><td>'+
				country.capital+'</td><td>'+country.region+'</td><td>'+country.population+
				'</td><td>'+country.area+'</td><td>'+country.language+
                '</td><td>'+country.currency+'</td><td>'+country.gdp+
                '</td><td><img src="'+country.flag_url+'" alt="'+country.name+' flag" style="width: 50px; height: auto;"></td><td id="'
                +country.id+'"><a href="#">Show Description</a></td></tr>');
	});
        var table = $('#countries_table_id').DataTable({
            searching: false,
            paging: true,
            ordering: true,
            autoWidth: false
        });
};

var renderDetails=function(country) {
    var modal = '<h4><strong>'+ country.name + '\'s</strong> Description</h4>';
    var htmlStr='<p>'+country.description+'<br><hr>';
    $("#countrysName").html(modal);
    $("#contents").html(htmlStr);
    $('#myModal').modal('show');
};

var searchByName = function() {
    var query = $("#searchName").val().trim();
    console.log('searchByName:', query);
    
    if (query.length >= 2) {
        $.ajax({
            type: 'GET',
            url: rootURL + '/search/' + encodeURIComponent(query),
            dataType: "json",
            success: function(data) {
                console.log('searchByName response:', data);
                handleSearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByRegion error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (query.length === 0) {
        reloadAllCountries();
    }
};

var searchByRegion = function() {
    var region = $("#searchRegion").val().trim();
    console.log('searchByRegion:', region);
    
    if (region.length >= 2) {
        $.ajax({
            type: 'GET',
            url: rootURL + '/region/' + encodeURIComponent(region),
            dataType: "json",
            success: function(data) {
                console.log('searchByRegion response:', data);
                handleSearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByRegion error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (region.length === 0) {
        reloadAllCountries();
    }
};

var searchByCapital = function() {
    var capital = $("#searchCapital").val().trim();
    console.log('searchByCapital:', capital);
    
    if (capital.length >= 2) {
        $.ajax({
            type: 'GET',
            url: rootURL + '/capital/' + encodeURIComponent(capital),
            dataType: "json",
            success: function(data) {
                console.log('searchByCapital response:', data);
                handleSearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByCapital error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (capital.length === 0) {
        reloadAllCountries();
    }
};

var searchByLanguage = function() {
    var language = $("#searchLanguage").val().trim();
    console.log('searchByLanguage:', language);
    
    if (language.length >= 2) {
        $.ajax({
            type: 'GET',
            url: rootURL + '/language/' + encodeURIComponent(language),
            dataType: "json",
            success: function(data) {
                console.log('searchByLanguage response:', data);
                handleSearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchByLanguage error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (language.length === 0) {
        reloadAllCountries();
    }
};

var handleSearchResponse = function(data) {
    console.log('handleSearchResponse data:', data);
    
    if ($.fn.DataTable.isDataTable('#countries_table_id')) {
        $('#countries_table_id').DataTable().destroy();
    }
    $('#countries_table_body').empty();
    
    var countriesArray = [];
    if (data.success && data.countries) {
        countriesArray = Array.isArray(data.countries) ? data.countries : [data.countries];
    }
    
    console.log('Countries to render:', countriesArray.length);

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
        
        $('#countries_table_id').DataTable( {
            searching: false,
            paging: true,
            ordering: true,
            autoWidth: false
        });
    }
};

var reloadAllCountries = function() {
    if ($.fn.DataTable.isDataTable('#countries_table_id')) {
        $('#countries_table_id').DataTable().destroy();
    }
    $('#countries_table_body').empty();
    findAll();
};

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

$(document).ready(function() {
    findAll();
    
    $(document).on("click", '#countries_table_body td', function() {
        findById(this.id);
    });

    $("#searchName").on("keyup", function() { searchByName(); });
    $("#searchRegion").on("keyup", function() { searchByRegion(); });
    $("#searchCapital").on("keyup", function() { searchByCapital(); });
    $("#searchLanguage").on("keyup", function() { searchByLanguage(); });
});