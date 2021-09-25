import eel
from random import randint
from getdata import *

eel.init("web")


@eel.expose
def make_login(zid, zpass, zpin):
    return make_zerodha_login(zid, zpass, zpin)

@eel.expose
def get_candle_data(exeToken,timeNum,candleTimeStr):
    return getCandleData(str(exeToken),int(timeNum),str(candleTimeStr))

eel.start("leveltable.html",port=8001)
