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

$(document).ready(function() {
    findAllUsers();
    
    $(document).on("click", '#users_table_body td', function() {
        findUserById(this.id);
    });
});
