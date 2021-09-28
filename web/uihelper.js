$(document).ready( function () {
	$('#infodiv').hide();
	$('#tradediv').hide();
    $('#userdiv').hide();
    $('#leveltable').DataTable();
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
    var qty = prompt("Please enter Quantity",1);
    if(isNaN(qty)){
        alert("Please Enter Valid Quantity");
        return;
    }
    $('#errormsg').text('Please Wait.....');
    eel.add_order_data(full_token,action,b1,b2,s1,s2,qty)(function(reqData) {
        //reqData = JSON.parse(res);
        if(reqData.flag){
            console.log(reqData);
            set_order_data_div(reqData.id);
            set_order_data_in_div(reqData);
            var intervalID = window.setInterval(function(){
                eel.get_order_data(reqData.id)(function(res) {
                    reqData = JSON.parse(res);
                    console.log(reqData);
                    if ($('#'+reqData.id+'_div').length){ set_order_data_in_div(reqData); }
                    else{ window.clearInterval(intervalID); }
                });
            }, 2000);
			$('#errormsg').text('Check Order Tag');
        }
        else{
            console.log(reqData);
			$('#errormsg').text('Error while adding order');
        }
    });
}


function set_order_data_div(oid)
{
    var divStr = 
    '<div class="card" id="'+oid+'_div">'+
        '<div class="card-body">'+
            '<div class="container">'+
                '<div class="row">'+
                    '<div class="col-sm">'+
                        '<div class="row">'+
                            '<div class="col-md-4">ID :</div>'+
                            '<div class="col-md-8"><h3 id="'+oid+'_id"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Token :</div>'+
                            '<div class="col-md-8"><b><h6 id="'+oid+'_token"></b></h6></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Action :</div>'+
                            '<div class="col-md-8"><h3 id="'+oid+'_action"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Status :</div>'+
                            '<div class="col-md-8"><h3 id="'+oid+'_status"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-4">Quantity :</div>'+
                            '<div class="col-md-8"><h3 id="'+oid+'_quantity"></h3></div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-sm">'+
                        '<div class="row">'+
                            '<div class="col-md-6">Trigger :</div>'+
                            '<div class="col-md-6"><h3 id="'+oid+'_trigger"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">SL :</div>'+
                            '<div class="col-md-6"><h3 id="'+oid+'_sl"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">Target :</div>'+
                            '<div class="col-md-6"><h3 id="'+oid+'_target"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">Trailing :</div>'+
                            '<div class="col-md-6"><h3 id="'+oid+'_trail"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">LTP :</div>'+
                            '<div class="col-md-6"><h3 id="'+oid+'_ltp"></h3></div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6">Entry Price :</div>'+
                            '<div class="col-md-6"><h3 id="'+oid+'_entry_price"></h3></div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-sm">'+
                        '<div class="row">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="'+oid+'_new_trigger" placeholder="New Trigger"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary"  onclick="updateTrigger('+oid+')" >Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="'+oid+'_new_sl" placeholder="New SL"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary" onclick="updateSl('+oid+')" >Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="'+oid+'_new_target" placeholder="New Target"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary" onclick="updateTarget('+oid+')" >Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-3">'+
                            '<div class="col-md-6"><input type="number" class="form-control" id="'+oid+'_new_trail" placeholder="New Trailing"></div>'+
                            '<div class="col-md-6">'+
                                '<button type="button" class="btn btn-primary" onclick="updateTrail('+oid+')" >Update</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row mt-4">'+
                            '<div class="col-md-4">'+
                                '<button type="button" class="btn btn-secondary" onclick="cancelOrder('+oid+')" >Cancel</button>'+
                            '</div>'+
                            '<div class="col-md-4">'+
                                '<button type="button" class="btn btn-danger" onclick="squareOffOrder('+oid+')" >Square-off</button>'+
                            '</div>'+
                            '<div class="col-md-4">'+
                                '<button type="button" class="btn btn-dark" onclick="deleteOrder('+oid+')" >Delete</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    $("#tradediv").prepend(divStr);
}

function set_order_data_in_div(reqData){
    $('#'+reqData.id+'_id').text(reqData.id);
    $('#'+reqData.id+'_token').text(reqData.token);
    $('#'+reqData.id+'_action').text(reqData.action);
    $('#'+reqData.id+'_status').text(reqData.status);
    $('#'+reqData.id+'_quantity').text(reqData.qty);
    $('#'+reqData.id+'_trigger').text(reqData.trigger.toFixed(2));
    $('#'+reqData.id+'_sl').text(reqData.sl);
    $('#'+reqData.id+'_target').text(reqData.target.toFixed(2));
    $('#'+reqData.id+'_trail').text(reqData.trail.toFixed(2));
    $('#'+reqData.id+'_ltp').text(reqData.ltp.toFixed(2));
    $('#'+reqData.id+'_entry_price').text(reqData.enter_price.toFixed(2));
}

function updateTrigger(oid){
    var new_target = $('#'+oid+'_new_trigger').val();
    eel.update_trigger_data(oid, new_target)(function(reqData) {
        if(reqData.status==1){
            console.log(reqData);
            $('#'+oid+'_new_trigger').val("");
        }
        else{
            console.log(reqData);
            $('#errormsg').text(reqData.error);
        }
    });
}

function updateSl(oid){
    var new_sl = $('#'+oid+'_new_sl').val();
    eel.update_sl_data(oid, new_sl)(function(reqData) {
        if(reqData.status==1){
            console.log(reqData);
            $('#'+oid+'_new_sl').val("");
        }
        else{
            console.log(reqData);
            $('#errormsg').text(reqData.error);
        }
    });
}

function updateTarget(oid){
    var new_target = $('#'+oid+'_new_target').val();
    eel.update_target_data(oid, new_target)(function(reqData) {
        if(reqData.status==1){
            console.log(reqData);
            $('#'+oid+'_new_target').val("");
        }
        else{
            console.log(reqData);
            $('#errormsg').text(reqData.error);
        }
    });
}

function updateTrail(oid){
    var new_trail = $('#'+oid+'_new_trail').val();
    eel.update_trail_data(oid, new_trail)(function(reqData) {
        if(reqData.status==1){
            console.log(reqData);
            $('#'+oid+'_new_trail').val("");
        }
        else{
            console.log(reqData);
            $('#errormsg').text(reqData.error);
        }
    });
}

function cancelOrder(oid){
    var status = $('#'+oid+'_status').text();
    if(status != "Waiting for trigger"){
        alert("Order is placed you can not cancel");
        return;
    }
    eel.cancel_order_data(oid)(function(reqData) {
        if(reqData.status==1){
            console.log(reqData);
            $('#'+oid+'_status').text("Order Canceled");
        }
        else{
            console.log(reqData);
            $('#errormsg').text(reqData.error);
        }
    });
}

function squareOffOrder(oid){
    var status = $('#'+oid+'_status').text();
    if(!(status == "bought" || status == "sold")){
        alert("Order is not active Square Off");
        return;
    }
    eel.square_off_data(oid)(function(reqData) {
        if(reqData.status==1){
            console.log(reqData);
            $('#'+oid+'_status').text("Square Off Manually");
        }
        else{
            console.log(reqData);
            $('#errormsg').text(reqData.error);
        }
    });
}
function deleteOrder(oid){
    var status = $('#'+oid+'_status').text();
    if(status == "bought" || status == "sold" || status == "Waiting for trigger" ){
        alert("Cancel or Square Off order you can not delete it");
        return;
    }
    $('#'+oid+'_div').remove();
}