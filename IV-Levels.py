import eel
from random import randint
from getdata import *
from tradehandle import *

eel.init("web")


@eel.expose
def make_login(zid, zpass, zpin):
    return make_zerodha_login(zid, zpass, zpin)


@eel.expose
def get_candle_data(exeToken, timeNum, candleTimeStr):
    return getCandleData(str(exeToken), int(timeNum), str(candleTimeStr))


@eel.expose
def add_order_data(full_token, action, b1, b2, s1, s2):
    b1 = float(b1)
    b2 = float(b2)
    s1 = float(s1)
    s2 = float(s2)
    if action == "Buy":
        status = "Waiting for trigger"
        trigger = b2
        sl = s1
        trail = b2 - sl
        target = b2 + trail
    else:
        status = "Waiting for trigger"
        trigger = s2
        sl = b1
        trail = sl - s2
        target = s2 - trail
    return add_Order(full_token, action, status, trigger, sl, target, trail)


@eel.expose
def update_trigger_data(id, new_trigger):
    return update_trigger(id, new_trigger)


@eel.expose
def update_sl_data(id, new_sl):
    return update_sl(id, new_sl)


@eel.expose
def update_target_data(id, new_target):
    return update_target(id, new_target)


@eel.expose
def update_trail_data(id, new_trail):
    return update_trail(id, new_trail)


@eel.expose
def square_off_data(id):
    return square_off(id)


@eel.expose
def cancel_order_data(id):
    return cancel_order(id)


eel.start("leveltable.html", port=8001)
