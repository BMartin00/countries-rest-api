/**
 * Users Management JavaScript File
 * Handles all user-related operations including CRUD operations, search, and UI interactions
 */

// Base API URL for user operations
var usersRootURL = "http://localhost/countries-rest-api/api/users"

// Base path for application assets
var appBasePath = "/countries-rest-api";

/**
 * Retrieve all users from the API and display them in the table
 */
var findAllUsers = function() {
	console.log('findAllUsers');
	$.ajax({
		type: 'GET',
		url: usersRootURL,
		dataType: "json",
		success: renderUserList
	});
};

/**
 * Render the list of users in the data table
 * @param {Object} data Response data containing users array
 */
var renderUserList = function(data) {
    console.log("DATA RECEIVED:", data);
	list=data.users;
    console.log("response");
    
    // Loop through each user and add to table
	$.each(list, function(index, user) {
        // Mask password for security
        var maskedPassword = '*'.repeat(user.password.length);
		$('#users_table_body').append('<tr><td>'+user.name+'</td><td>'+
				user.username+'</td><td>'+maskedPassword+'</td><td><img src="'+appBasePath+'/pics/'+user.image+
                '" alt=" user" style="width: 50px; height: auto;"></td></tr>');
	});

    // Initialise DataTable with configuration
    var table = $('#users_table_id').DataTable({
        searching: false,
        paging: true,
        ordering: true,
        autoWidth: false
    });
};

/**
 * Search for users by username using the API
 * Triggers on keyup with minimum 2 characters
 */
var searchUserByUsername = function() {
    var userUsername = $("#searchUserUsername").val().trim();
    console.log('searchUserByUsername:', userUsername);
    
    // Only search if there is at least 2 characters
    if (userUsername.length >= 2) {
        $.ajax({
            type: 'GET',
            url: usersRootURL + '/search/' + encodeURIComponent(userUsername),
            dataType: "json",
            success: function(data) {
                console.log('searchUserByUsername response:', data);
                handleUserSearchResponse(data);
            },
            error: function(xhr, status, error) {
                console.log('searchUserByUsername error:', error);
                showError('Search error: ' + error);
            }
        });
    } else if (userUsername.length === 0) {
        // If search field is empty, reload all users
        reloadAllUsers();
    }
};

/**
 * Handle the response from user search and update the table
 * @param {Object} data Search response data
 */
var handleUserSearchResponse = function(data) {
    console.log('handleUserSearchResponse data:', data);
    
    // Clear existing DataTable and content
    if ($.fn.DataTable.isDataTable('#users_table_id')) {
        $('#users_table_id').DataTable().destroy();
    }
    $('#users_table_body').empty();
    
    // Extract users array from response
    var usersArray = [];
    if (data.success && data.users) {
        usersArray = Array.isArray(data.users) ? data.users : [data.users];
    }
    
    console.log('Users to render:', usersArray.length);

    // Handle empty results
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
        // Render each user in the table
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
        
        // Reinitialise DataTable
        $('#users_table_id').DataTable( {
            searching: false,
            paging: true,
            ordering: true,
            autoWidth: false
        });
    }
};

/**
 * Reload all users by clearing table and fetching fresh data
 */
var reloadAllUsers = function() {
    if ($.fn.DataTable.isDataTable('#users_table_id')) {
        $('#users_table_id').DataTable().destroy();
    }
    $('#users_table_body').empty();
    findAllUsers();
};

/**
 * Display error message in the users table
 * @param {string} message Error message to display
 */
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

/**
 * Add a new user via API
 * Validates form data before submission
 * @returns {void}
 */
var addUser = function() {
    console.log("addUser function called");
    
    // Collect form data
    var userData = {
        name: $("#userName").val(),
        username: $("#userUsername").val(),
        password: $("#userPassword").val(),
        image: $("#userImage").val(),
    };

    console.log("User data to be sent:", userData);

    // Validate all fields are filled
    for (var key in userData) {
        if (!userData[key]) {
            alert("Please fill in all fields! Missing: " + key);
            return false;
        }
    }

    // Submit new user to API
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

/**
 * Load user data for updating by searching with username
 * Enables the update form if user is found
 * @returns {void}
 */
var loadUserForUpdate = function() {
    var userName = $("#updateUserName").val().trim();
    
    if (!userName) {
        return;
    }

    console.log("Loading user data for:", userName);

    // Search for user by username
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

            // Extract user data (handle both array and single object responses)
            var user = searchData.users;
            if (Array.isArray(user)) {
                user = user[0];
            }

            // Populate form fields with user data
            $("#updatedUserName").val(user.name || '');
            $("#updateUserUsername").val(user.username || '');
            $("#updateUserPassword").val(user.password || '');
            $("#updateUserImage").val(user.image || '');

            // Store user ID for the update operation
            $("#updateUserForm").data('userId', user.id);

            // Show success and enable form
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

/**
 * Enable the user update form fields and submit button
 */
var enableUserUpdateForm = function() {
    $("#updatedUserName").prop('disabled', false);
    $("#updateUserUsername").prop('disabled', false);
    $("#updateUserPassword").prop('disabled', false);
    $("#updateUserImage").prop('disabled', false);
    $("#btnConfirmUpdateUser").prop('disabled', false);
};

/**
 * Disable the user update form fields and submit button
 */
var disableUserUpdateForm = function() {
    $("#updatedUserName").prop('disabled', true).val('');
    $("#updateUserUsername").prop('disabled', true).val('');
    $("#updateUserPassword").prop('disabled', true).val('');
    $("#updateUserImage").prop('disabled', true).val('');
    $("#btnConfirmUpdateUser").prop('disabled', true);
};

/**
 * Update an existing user with modified data
 * Validates all fields before submission
 * @returns {void}
 */
var updateUser = function() {
    console.log("updateUser function called");
    
    var userId = $("#updateUserForm").data('userId');
    var originalName = $("#updateUserForm").data('originalName');
    var newName = $("#updatedUserName").val().trim();
    
    // Validate that there is a user loaded
    if (!userId) {
        alert("Please first load a user by entering its name!");
        return false;
    }

    // Collect updated user data
    var updatedUserData = {
        name: newName,
        username: $("#updateUserUsername").val(),
        password: $("#updateUserPassword").val(),
        image: $("#updateUserImage").val(),
    };

    console.log("Update data:", updatedUserData);

    // Validate all fields are filled
    for (var key in updatedUserData) {
        if (!updatedUserData[key]) {
            alert("Please fill in all fields! Missing: " + key);
            return false;
        }
    }

    // Submit update to API
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

/**
 * Delete a user after confirmation
 * First searches for user, then deletes if found
 * @returns {void}
 */
var deleteUser = function() {
    console.log("deleteUser function called");
    
    var userName = $("#deleteUserName").val().trim();
    
    if (!userName) {
        alert("Please enter a name to delete!");
        return false;
    }

    // First search for the user to get their ID
    $.ajax({
        type: 'GET',
        url: usersRootURL + '/search/' + encodeURIComponent(userName),
        dataType: "json",
        success: function(searchUserData) {
            if (!searchUserData.success || !searchUserData.users) {
                alert("User not found! Please check the name and try again.");
                return;
            }

            // Extract user data
            var user = searchUserData.users;
            if (Array.isArray(user)) {
                user = user[0];
            }

            var userId = user.id;
            
            // Confirm deletion with user
            if (confirm("Are you sure you want to delete " + userName + "? This action cannot be undone.")) {
                // Proceed with deletion
                $.ajax({
                    type: 'DELETE',
                    url: usersRootURL + '/' + userId,
                    dataType: "json",
                    success: function(data) {
                        console.log('User deleted successfully:', data);
                        $('#deleteUserModal').modal('hide');
                        $('#deleteUserForm')[0].reset();
                        reloadAllUsers();
                        alert("User deleted successfully!");
                    },
                    error: function(xhr, status, error) {
                        console.log('Delete user error:', xhr.responseText);
                        alert("Error deleting user: " + xhr.responseText);
                    }
                });
            }
        },
        error: function(xhr, status, error) {
            alert("Error finding user: " + error);
        }
    });
};

/**
 * Document ready function - initialises all event handlers and loads initial data
 */
$(document).ready(function() {
    // Load all users on page load
    findAllUsers();

    // Search functionality
    $("#searchUserUsername").on("keyup", function() { searchUserByUsername(); });

    // Add User modal handlers
    $("#addUserButton").on("click", function() {
        $('#addUserModal').modal('show');
    });

    $("#btnConfirmAddUser").on("click", function() {
        addUser();
    });

    // Update User modal handlers
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

    // Delete User modal handlers
    $("#deleteUserButton").on("click", function() {
        $('#deleteUserModal').modal('show');
    });

    $("#btnConfirmDeleteUser").on("click", function() {
        deleteUser();
    });

    // Modal clenaup handlers
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

    $('#deleteUserModal').on('hidden.bs.modal', function () {
        $('#deleteUserForm')[0].reset();
    });

    // Prevent form submission on Enter key in delete user modal
    $("#deleteUserForm").on("keypress", function(e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            deleteUser();
        }
    });

    // Also prevent the default form submission
    $("#deleteUserForm").on("submit", function(e) {
        e.preventDefault();
    });
});
