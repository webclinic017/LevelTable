$(document).ready( function () {
	$('#infodiv').hide();
	$('#tradediv').hide();
    $('#userdiv').hide();
    $('#leveltable').DataTable();
    set_order_data_div();
    set_order_data_div();
} );

function login() {
	zid = $('#zid').val();
	zpass = $('#zpass').val();
	zpin = $('#zpin').val();
	make_login(zid,zpass,zpin);
}

function showLevels(){
    $('#title_text').text("LEVEL TABLE");
    $('#tradediv').hide();
    $('#userdiv').hide();
    $('#infodiv').show();
}
function showOrders(){
    $('#title_text').text("ORDERS TABLE");
    $('#infodiv').hide();
    $('#userdiv').hide();
    $('#tradediv').show();
}
function showUsers(){
    $('#title_text').text("USERS TABLE");
    $('#infodiv').hide();
    $('#tradediv').hide();
    $('#userdiv').show();
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
	var passStr = "'"+exchange+"',"+"'"+token+"',"+"'"+b1+"',"+"'"+b2+"',"+"'"+s1+"',"+"'"+s2+"'";
	var tradeButtonTd = '<button type="button" class="btn btn-primary" onclick="takeTrade('+passStr+',this)">Trade</button>';
	var delButtonTd = '<button type="button" class="btn btn-danger" onclick="deleteRow(this)">Remove</button>';
	var actionDropDown = '<select class="form-select actionSelect"><option value="Buy">Buy</option><option value="Sell">Sell</option><option value="Both">Both</option></select>';
	tableObj.row.add([exchange,token,timeframe,candleTime,date,open,high,low,close,b1,b2,s1,s2,actionDropDown,tradeButtonTd,delButtonTd]).draw();
}

function deleteRow(btnRow) {
	$('#leveltable').DataTable().row(btnRow.closest('tr')).remove().draw();
}

function takeTrade(exchange,token,b1,b2,s1,s2,btnRow){
    var action = $(btnRow.closest('tr')).find('select option:selected').text();
    var full_token = exchange+":"+token;
    if(action=="Buy"){
        send_order_data(full_token,"Buy",b1,b2,s1,s2);
    }
    else if(action=="Sell"){
        send_order_data(full_token,"Sell",b1,b2,s1,s2);
    }
    else if(action=="Both"){
        send_order_data(full_token,"Buy",b1,b2,s1,s2);
        send_order_data(full_token,"Sell",b1,b2,s1,s2);
    }
    else{
        alert("Select Action type");
    }

}

function send_order_data(full_token,action,b1,b2,s1,s2){
    $('#errormsg').text('Please Wait.....');
    eel.add_order_data(full_token,action,b1,b2,s1,s2)(function(res) {
        reqData = JSON.parse(res);
        if(reqData.flag){
            console.log(reqData);
			$('#errormsg').text('Check Order Tag');
        }
        else{
            console.log(res);
			$('#errormsg').text('Error while adding order');
        }
    })
}


function set_order_data_div()
{
    var divStr = 
    '<div class="card">'+
        '<div class="card-body">'+
            '<div class="container">'+
                '<div class="row">'+
                    '<div class="col-sm">'+
                        '<div class="row">'+
                            '<div class="col-md-4">ID :</div>'+
                            '<div class="col-md-8"><h3>12</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Token :</div>'+
                            '<div class="col-md-8"><h3>12</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Action :</div>'+
                            '<div class="col-md-8"><h3>Buy</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Status :</div>'+
                            '<div class="col-md-8"><h3>Waiting for buy</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Time :</div>'+
                            '<div class="col-md-8"><h3>12:35</h3></div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-sm">'+
                        '<div class="row">'+
                            '<div class="col-md-6">Trigger :</div>'+
                            '<div class="col-md-6"><h3>13.45</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">SL :</div>'+
                            '<div class="col-md-6"><h3>13.45</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">Target :</div>'+
                            '<div class="col-md-6"><h3>13.45</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">Trailing :</div>'+
                            '<div class="col-md-6"><h3>13.45</h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">LTP :</div>'+
                            '<div class="col-md-6"><h3>13.45</h3></div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-sm">'+
                        '<div class="row">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="newtrigger" placeholder="New Trigger"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary">Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="newsl" placeholder="New SL"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary">Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="newtarget" placeholder="New Target"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary">Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="newtrailing" placeholder="New Trailing"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary">Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-4">'+
                            '<div class="col-md-4">'+
                                '<button type="button" class="btn btn-secondary">Cancel</button>'+
                            '</div>'+
                            '<div class="col-md-4">'+
                                '<button type="button" class="btn btn-danger">Square-off</button>'+
                            '</div>'+
                            '<div class="col-md-4">'+
                                '<button type="button" class="btn btn-dark">Delete</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    $("#tradediv").prepend(divStr);
}