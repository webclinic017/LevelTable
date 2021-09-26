from users import *

order_list = {}
order_counter = 0


def get_ltp(tokenOrSymbol):
    return 100
    # return float(kite.ltp(tokenOrSymbol)[tokenOrSymbol]['last_price'])


def add_Order(full_token, action, status, trigger, sl, target, trail):
    global order_counter
    order_counter = order_counter + 1
    id = order_counter
    try:
        order_list[id] = {}
        order_list[id]['token'] = full_token
        order_list[id]['action'] = action
        order_list[id]['status'] = status
        order_list[id]['trigger'] = trigger
        order_list[id]['sl'] = sl
        order_list[id]['target'] = target
        order_list[id]['trail'] = trail
        order_list[id]['ltp'] = get_ltp(full_token)
        order_list[id]['flag'] = True
        print(order_list[id])
        return {'status': 1, 'id': id}
    except Exception as e:
        print("Error while Adding Order list ", id, str(e))
        return {'status': 0, 'error': str(e)}


def update_trigger(id, new_trigger):
    try:
        order_list[id]['trigger'] = new_trigger
        return {'status': 1, 'trail': order_list[id]['trigger']}
    except Exception as e:
        print("Error while updating Trigger in ", id, str(e))
        return {'status': 0, 'error': str(e)}


def update_sl(id, new_sl):
    try:
        order_list[id]['sl'] = new_sl
        return {'status': 1, 'sl': order_list[id]['sl']}
    except Exception as e:
        print("Error while updating SL in ", id, str(e))
        return {'status': 0, 'error': str(e)}


def update_target(id, new_target):
    try:
        order_list[id]['target'] = new_target
        return {'status': 1, 'target': order_list[id]['target']}
    except Exception as e:
        print("Error while updating Target in ", id, str(e))
        return {'status': 0, 'error': str(e)}


def update_trail(id, new_trail):
    try:
        order_list[id]['trail'] = new_trail
        return {'status': 1, 'trail': order_list[id]['trail']}
    except Exception as e:
        print("Error while updating Trail in ", id, str(e))
        return {'status': 0, 'error': str(e)}
