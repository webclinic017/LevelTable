from users import *
import json
import time
from pprint import pprint
import datetime
from login import *

order_list = {}
order_counter = 0
is_order_completion_running = False
IS_REAL_ORDER = True


def get_ltp(tokenOrSymbol):
    return float(kite.ltp(tokenOrSymbol)[tokenOrSymbol]['last_price'])


def buy(symbol, qty):
    print("Buy", symbol, qty)
    buySellFromAllUser(symbol, "BUY", qty)
    return get_ltp(symbol)


def sell(symbol, qty):
    print("Sell", symbol, qty)
    buySellFromAllUser(symbol, "SELL", qty)
    return get_ltp(symbol)


def add_Order(full_token, action, status, trigger, sl, target, trail, qty):
    global order_counter
    global is_order_completion_running
    order_counter = order_counter + 1
    id = order_counter
    try:
        order_list[id] = {}
        order_list[id]['id'] = id
        order_list[id]['token'] = full_token
        order_list[id]['action'] = action
        order_list[id]['status'] = status
        order_list[id]['trigger'] = trigger
        order_list[id]['sl'] = sl
        order_list[id]['target'] = target
        order_list[id]['trail'] = trail
        order_list[id]['ltp'] = get_ltp(full_token)
        order_list[id]['flag'] = True
        order_list[id]['qty'] = qty
        order_list[id]['enter_price'] = 0
        order_list[id]['trail_price'] = 0
        print(order_list[id])
        if not is_order_completion_running:
            threading.Thread(target=order_completion).start()
            is_order_completion_running = True
        return order_list[id]
    except Exception as e:
        print("Error while Adding Order list ", id, str(e))
        return {'flag': False, 'error': str(e)}


def update_trigger(id, new_trigger):
    try:
        order_list[id]['trigger'] = new_trigger
        pprint(order_list[id])
        return {'status': 1, 'trail': order_list[id]['trigger']}
    except Exception as e:
        print("Error while updating Trigger in ", id, str(e))
        return {'status': 0, 'error': str(e)}


def update_sl(id, new_sl):
    try:
        order_list[id]['sl'] = new_sl
        print("SL updated ",order_list[id]['sl'])
        return {'status': 1, 'sl': order_list[id]['sl']}
    except Exception as e:
        print("Error while updating SL in ", id, str(e))
        return {'status': 0, 'error': str(e)}


def update_target(id, new_target):
    try:
        order_list[id]['target'] = new_target
        print("target updated ",order_list[id]['target'])
        return {'status': 1, 'target': order_list[id]['target']}
    except Exception as e:
        print("Error while updating Target in ", id, str(e))
        return {'status': 0, 'error': str(e)}


def update_trail(id, new_trail):
    try:
        order_list[id]['trail'] = new_trail
        if order_list[id]['action'] == "Buy":
            order_list[id]['trail_price'] = order_list[id]['enter_price'] + order_list[id]['trail']
        if order_list[id]['action'] == "Sell":
            order_list[id]['trail_price'] = order_list[id]['enter_price'] - order_list[id]['trail']
        print("trail updated ",order_list[id]['trail'])
        return {'status': 1, 'trail': order_list[id]['trail']}
    except Exception as e:
        print("Error while updating Trail in ", id, str(e))
        return {'status': 0, 'error': str(e)}


def square_off(id):
    if order_list[id]['status'] == "bought":
        order_list[id]['flag'] = False
        sell(order_list[id]['token'], order_list[id]['qty'])
        order_list[id]['status'] = "Square Off Manually"
        print("Square Off Manually ", order_list[id]['status'])
        return {'status': 1}
    elif order_list[id]['status'] == "sold":
        order_list[id]['flag'] = False
        buy(order_list[id]['token'], order_list[id]['qty'])
        order_list[id]['status'] = "Square Off Manually"
        print("Square Off Manually ", order_list[id]['status'])
        return {'status': 1}
    else:
        return {'status': 0}


def cancel_order(id):
    if order_list[id]['status'] == "Waiting for trigger":
        order_list[id]['flag'] = False
        order_list[id]['status'] = "Order Canceled"
        print("Order Canceled ", order_list[id]['id'])
        return {'status': 1}
    return {'status': 0}


def order_data(id):
    return json.dumps(order_list[id])


def order_completion():
    while len(order_list) > 0:
        for orders in list(order_list):
            check_order_conditions(order_list[orders])
            time.sleep(0.2)
        time.sleep(0.1)


def check_order_conditions(order_data):
    if order_data['flag'] and order_data['action'] == "Buy":
        try:
            order_data['ltp'] = get_ltp(order_data['token'])
            check_buy_conditions(order_data)
        except Exception as e:
            print("Error while getting LTP for ",order_data['token'],"Error ",str(e))

    elif order_data['flag'] and order_data['action'] == "Sell":
        try:
            order_data['ltp'] = get_ltp(order_data['token'])
            check_sell_conditions(order_data)
        except Exception as e:
            print("Error while getting LTP for ",order_data['token'],"Error ",str(e))


def check_buy_conditions(order_data):
    if order_data['status'] == "Waiting for trigger" and order_data['ltp'] >= order_data['trigger']:
        order_data['status'] = "bought"
        order_data['enter_price'] = buy(order_data['token'], order_data['qty'])
        order_data['trail_price'] = order_data['enter_price'] + order_data['trail']
        print(order_data)
    elif order_data['status'] == "bought" and order_data['ltp'] <= order_data['sl']:
        sell(order_data['token'], order_data['qty'])
        order_data['status'] = "SL hit"
        order_data['flag'] = False
        print(order_data)
    elif order_data['status'] == "bought" and order_data['ltp'] >= order_data['target']:
        sell(order_data['token'], order_data['qty'])
        order_data['status'] = "Got the Target"
        order_data['flag'] = False
        print(order_data)
    elif order_data['status'] == "bought" and order_data['ltp'] >= order_data['trail_price']:
        order_data['sl'] = order_data['sl'] + order_data['trail']
        order_data['trail_price'] = order_data['enter_price'] + order_data['trail']
        print(order_data)


def check_sell_conditions(order_data):
    if order_data['status'] == "Waiting for trigger" and order_data['ltp'] <= order_data['trigger']:
        order_data['status'] = "sold"
        order_data['enter_price'] = sell(order_data['token'], order_data['qty'])
        order_data['trail_price'] = order_data['enter_price'] - order_data['trail']
        print(order_data)
    elif order_data['status'] == "sold" and order_data['ltp'] >= order_data['sl']:
        buy(order_data['token'], order_data['qty'])
        order_data['status'] = "SL hit"
        order_data['flag'] = False
        print(order_data)
    elif order_data['status'] == "sold" and order_data['ltp'] <= order_data['target']:
        buy(order_data['token'], order_data['qty'])
        order_data['status'] = "Got the Target"
        order_data['flag'] = False
        print(order_data)
    elif order_data['status'] == "sold" and order_data['ltp'] <= order_data['trail_price']:
        order_data['sl'] = order_data['sl'] - order_data['trail']
        order_data['trail_price'] = order_data['enter_price'] - order_data['trail']
        print(order_data)
