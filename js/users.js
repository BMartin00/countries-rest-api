var usersRootURL = "http://localhost/countries-rest-api/api/users"

var findAllUsers = function(){
	console.log('findAllUsers');
	$.ajax({
		type: 'GET',
		url: usersRootURL,
		dataType: "json",
		success: renderUserList
	});
};

var findUserById = function(id){
    console.log('findUserById: ' + id);
    $.ajax({
        type: 'GET',
        url: usersRootURL + '/' + id,
        dataType: "json",
        success: function(data){
            console.log('findUserById success:', data);

            var user = data.user;
            renderUserDetails(user);
        }
    });
};

var renderUserList = function(data) {
    console.log("DATA RECEIVED:", data);
	list=data.users;
        console.log("response");
	$.each(list, function(index, user) {
		$('#users_table_body').append('<tr><td>'+user.name+'</td><td>'+
				user.username+'</td><td>'+user.password+'</td><td>'+user.image+'</td></tr>');
	});
        var table = $('#users_table_id').DataTable({
            searching: false,
            paging: true,
            ordering: true,
            autoWidth: false
        });
};

var searchUserByName = function() {
    var userName = $("#searchUserName").val().trim();
    console.log('searchUserByName:', userName);
    
    if (userName.length >= 2) {
        $.ajax({
            type: 'GET',
            url: usersRootURL + '/search/' + encodeURIComponent(userName),
            dataType: "json",
            success: function(data) {
                console.log('searchUserByName response:', data);
                handleUserSearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchUserByName error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (userName.length === 0) {
        reloadAllUsers();
    }
};

var handleUserSearchResponse = function(data) {
    console.log('handleUserSearchResponse data:', data);
    
    if ($.fn.DataTable.isDataTable('#users_table_id')) {
        $('#users_table_id').DataTable().destroy();
    }
    $('#users_table_body').empty();
    
    var usersArray = [];
    if (data.success && data.users) {
        usersArray = Array.isArray(data.users) ? data.users : [data.users];
    }
    
    console.log('Users to render:', usersArray.length);

    if (usersArray.length === 0) {
        $('#users_table_body').html('<tr><td colspan="10" class="text-center">' + (data.message || 'No users found') + '</td></tr>');
        
        $('#users_table_id').DataTable({
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            autoWidth: false
        });
    } else {
        $.each(usersArray, function(index, user) {
            if (user && user.id) {
                $('#users_table_body').append(
                    '<tr>' +
                    '<td>' + (user.name || '') + '</td>' +
                    '<td>' + (user.username || '') + '</td>' +
                    '<td>' + (user.password || '') + '</td>' +
                    '<td>' + (user.image || '') + '</td>' +
                    '</tr>'
                );
            }
        });
        
        $('#users_table_id').DataTable( {
            searching: false,
            paging: true,
            ordering: true,
            autoWidth: false
        });
    }
};

var reloadAllUsers = function() {
    if ($.fn.DataTable.isDataTable('#users_table_id')) {
        $('#users_table_id').DataTable().destroy();
    }
    $('#users_table_body').empty();
    findAllUsers();
};

var showError = function(message) {
    if ($.fn.DataTable.isDataTable('#users_table_id')) {
        $('#users_table_id').DataTable().destroy();
    }
    $('#users_table_body').html('<tr><td colspan="10">' + message + '</td></tr>');
    $('#users_table_id').DataTable({
        searching: false,
        paging: true,
        ordering: true,
        info: false,
        autoWidth: false
    });
};

$(document).ready(function() {
    findAllUsers();
    
    $(document).on("click", '#users_table_body td', function() {
        findUserById(this.id);
    });

    $("#searchUserName").on("keyup", function() { searchUserByName(); });
});
