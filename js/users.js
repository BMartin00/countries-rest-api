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

var addUser = function() {
    console.log("addUser function called");
    
    var userData = {
        name: $("#userName").val(),
        username: $("#userUsername").val(),
        password: $("#userPassword").val(),
        image: $("#userImage").val(),
    };

    console.log("User data to be sent:", userData);

    for (var key in userData) {
        if (!userData[key]) {
            alert("Please fill in all fields! Missing: " + key);
            return false;
        }
    }

    if (!isValidUrl(userData.image)) {
        alert("Please enter a valid URL for the image (e.g., https://flagcdn.com/CHANGETHIS.svg)");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: usersRootURL,
        data: JSON.stringify(userData),
        contentType: 'application/json',
        dataType: "json",
        success: function(data) {
            console.log('User added successfully:', data);
            $('#addUserModal').modal('hide');
            $('#addUserForm')[0].reset();
            reloadAllUsers();
            alert("User added successfully!");
        },
        error: function(xhr, status, error) {
            console.log('Add user error:', xhr.responseText);
            alert("Error adding user: " + xhr.responseText);
        }
    });
};




function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

$(document).ready(function() {
    findAllUsers();

    $("#searchUserName").on("keyup", function() { searchUserByName(); });

    $("#addUserButton").on("click", function() {
        $('#addUserModal').modal('show');
    });

    $("#btnConfirmAddCountry").on("click", function() {
        addUser();
    });

    // Clear forms when modals are closed
    $('#addUserModal').on('hidden.bs.modal', function () {
        $('#addUserForm')[0].reset();
    });
});
