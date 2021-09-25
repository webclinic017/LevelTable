import datetime
from mykite import *

kite = Zerodha()


def make_zerodha_login(zid, zpass, zpin):
    global kite
    kite = getConnection(zid, zpass, zpin, kite)
    if kite == "e1" or kite == "e2":
        return 0
    else:
        print("Login Done")
        return 1
