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

            // extract the actual country object
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
                '</td><td>'+country.flag_url+'</td><td id="'+country.id+'"><a href="#">More Info</a></td></tr>');
	});
        // $('#countries_table_id').DataTable();
        var table = $('#countries_table_id').DataTable({
            searching: false,  // disable default search bar
            paging: true,
            ordering: true
        });
};

var renderDetails=function(country) {
    //$('#modalCountryPic').attr('src', country.flag_url);
    var htmlStr='<h2>'+country.name+'</h2><h2>'+country.capital+'</h2><p>'+country.description+'<br><hr>';
    $("#contents").html(htmlStr);
    $('#myModal').modal('show');
};

$(document).ready(function(){
	findAll();
    $(document).on("click", '#countries_table_body td', function(){
        findById(this.id);
    });
});