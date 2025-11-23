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

var loadUserForUpdate = function() {
    var userName = $("#updateUserName").val().trim();
    
    if (!userName) {
        return;
    }

    console.log("Loading user data for:", userName);

    $.ajax({
        type: 'GET',
        url: usersRootURL + '/search/' + encodeURIComponent(userName),
        dataType: "json",
        success: function(searchData) {
            if (!searchData.success || !searchData.users) {
                $("#userFoundAlert").hide();
                $("#userNotFoundAlert").show();
                disableUserUpdateForm();
                return;
            }

            var user = searchData.users;
            if (Array.isArray(user)) {
                user = user[0];
            }

            $("#updatedUserName").val(user.name || '');
            $("#updateUserUsername").val(user.username || '');
            $("#updateUserPassword").val(user.password || '');
            $("#updateUserImage").val(user.image || '');

            $("#updateUserForm").data('userId', user.id);

            $("#userNotFoundAlert").hide();
            $("#userFoundAlert").show();
            enableUserUpdateForm();
        },
        error: function(xhr, status, error) {
            $("#userFoundAlert").hide();
            $("#userNotFoundAlert").show();
            disableUserUpdateForm();
        }
    });
};

var enableUserUpdateForm = function() {
    $("#updatedUserName").prop('disabled', false);
    $("#updateUserUsername").prop('disabled', false);
    $("#updateUserPassword").prop('disabled', false);
    $("#updateUserImage").prop('disabled', false);
    $("#btnConfirmUpdateUser").prop('disabled', false);
};

var disableUserUpdateForm = function() {
    $("#updatedUserName").prop('disabled', true).val('');
    $("#updateUserUsername").prop('disabled', true).val('');
    $("#updateUserPassword").prop('disabled', true).val('');
    $("#updateUserImage").prop('disabled', true).val('');
    $("#btnConfirmUpdateUser").prop('disabled', true);
};

var updateUser = function() {
    console.log("updateUser function called");
    
    var userId = $("#updateUserForm").data('userId');
    var originalName = $("#updateUserForm").data('originalName');
    var newName = $("#updatedUserName").val().trim();
    
    if (!userId) {
        alert("Please first load a user by entering its name!");
        return false;
    }

    var updatedUserData = {
        name: newName,
        username: $("#updateUserUsername").val(),
        password: $("#updateUserPassword").val(),
        image: $("#updateUserImage").val(),
    };

    console.log("Update data:", updatedUserData);

    for (var key in updatedUserData) {
        if (!updatedUserData[key]) {
            alert("Please fill in all fields! Missing: " + key);
            return false;
        }
    }

    if (!isValidUrl(updatedUserData.image)) {
        alert("Please enter a valid URL for the image");
        return false;
    }

    $.ajax({
        type: 'PUT',
        url: usersRootURL + '/' + userId,
        data: JSON.stringify(updatedUserData),
        contentType: 'application/json',
        dataType: "json",
        success: function(data) {
            console.log('User updated successfully:', data);
            $('#updateUserModal').modal('hide');
            $('#updateUserForm')[0].reset();
            $("#updateUserForm").removeData('userId');
            disableUserUpdateForm();
            $("#userFoundAlert").hide();
            $("#userNotFoundAlert").hide();
            reloadAllUsers();
            alert("User updated successfully!");
        },
        error: function(xhr, status, error) {
            console.log('Update user error:', xhr.responseText);
            alert("Error updating user: " + xhr.responseText);
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

    $("#btnConfirmAddUser").on("click", function() {
        addUser();
    });

    $("#updateUserButton").on("click", function() {
        $('#updateUserModal').modal('show');
        disableUserUpdateForm();
        $("#userFoundAlert").hide();
        $("#userNotFoundAlert").hide();
    });

    $("#updateUserName").on("keypress", function(e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            loadUserForUpdate();
        }
    });

    $("#updateUserName").on("blur", function() {
        loadUserForUpdate();
    });

    $("#btnConfirmUpdateUser").on("click", function() {
        updateUser();
    });

    // Clear forms when modals are closed
    $('#addUserModal').on('hidden.bs.modal', function () {
        $('#addUserForm')[0].reset();
    });

    $('#updateUserModal').on('hidden.bs.modal', function () {
        $('#updateUserForm')[0].reset();
        $("#updateUserForm").removeData('userId');
        $("#updateUserForm").removeData('originalName');
        disableUserUpdateForm();
        $("#userFoundAlert").hide();
        $("#userNotFoundAlert").hide();
    });
});
