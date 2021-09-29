const user_map = new Map();

$(document).ready( function () {
    $('#usertable').DataTable();
} );

function adduser(){
    userid = $('#userid').val();
	userpass = $('#userpass').val();
	userpin = $('#userpin').val();
	userlot = $('#userlot').val();
	for (let [key, value] of order_map) {
	    if(userid==key && value){
	        alert("User already added");
	        return;
	    }
    }
	order_map.set(userid,true);
	eel.add_user_data(userid, userpass, userpin, userlot)(function(reqData) {
        if(reqData.status==1){
            var tableObj = $('#usertable').DataTable();
            var uid = "'"+reqData.id+"'";
            var delUserBtn = '<button type="button" class="btn btn-danger" onclick="removeUser('+uid+',this)">Remove</button>';
            console.log(reqData);
            tableObj.row.add([reqData.name,reqData.id,reqData.password,reqData.pin,reqData.lot,delUserBtn]).draw();
        }
        else{
            order_map.set(userid,false);
            alert(reqData.error);
        }
    });
}

function removeUser(userId,btnRow){
    eel.remove_user_data(userId)(function(reqData) {
        if(reqData.status==1){
            console.log(reqData);
            $('#usertable').DataTable().row(btnRow.closest('tr')).remove().draw();
            order_map.set(userid,false);
        }
        else if(reqData.error == "'"+userId+"'"){
            console.log(reqData);
            $('#usertable').DataTable().row(btnRow.closest('tr')).remove().draw();
        }
        else{
            console.log(reqData);
            alert(reqData.error);
        }
    });
}