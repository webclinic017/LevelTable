$(document).ready( function () {
	$('#infodiv').hide();
    $('#leveltable').DataTable();
} );

function login() {
	zid = $('#zid').val();
	zpass = $('#zpass').val();
	zpin = $('#zpin').val();
	make_login(zid,zpass,zpin);
}

function make_login(zid,zpass,zpin){
	$('#errormsg').text('Please Wait.....');
    eel.make_login(zid,zpass,zpin)(function(res) {
        if(res==1){
			$('#infodiv').show();
            console.log("Login success");
			$('#errormsg').text('Login success');
        }
        else{
            console.log("Login Failure");
			$('#errormsg').text('Login Failure');
        }
    })
}

function getLevels(){
	exchange = $('#exchange option:selected').val();
	tokenName = $('#stoken').val();
	timeframe = $('#timeframe option:selected').text();
	candleTime = $('#ctime').val();
	candleDate = $('#cdate').val();
	token = (exchange+":"+tokenName);
	dateTimeString = candleDate+" "+candleTime;
	console.log(token,timeframe,dateTimeString);
	eel.get_candle_data(token,timeframe,dateTimeString)(function(res) {
		reqData = JSON.parse(res);
		console.log(reqData);
		if(reqData.status == 1)
		{
			addRow(exchange,tokenName,timeframe,reqData.candleTime,reqData.date,reqData.open,reqData.high,reqData.low,reqData.close,reqData.b1,reqData.b2,reqData.s1,reqData.s2);
			console.log(reqData.date);
			$('#errormsg').text('Data Added');
		}
		else{
			console.log(reqData.error);
			$('#errormsg').text(reqData.error);
		}
    })
}

function addRow(exchange,token,timeframe,candleTime,date,open,high,low,close,b1,b2,s1,s2){
	var tableObj = $('#leveltable').DataTable();
	var delButtonTd = '<button type="button" class="btn btn-danger" onclick="deleteRow(this)">Remove</button>';
	tableObj.row.add([exchange,token,timeframe,candleTime,date,open,high,low,close,b1,b2,s1,s2,delButtonTd]).draw();
}

function deleteRow(btnRow) {
	$('#leveltable').DataTable().row(btnRow.closest('tr')).remove().draw();
}
