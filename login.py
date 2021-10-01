import datetime
from kiteconnect import KiteConnect

kite = KiteConnect(api_key="")


def make_zerodha_login(api_key, access_token):
    global kite
    try:
        kite.api_key = api_key
        kite.set_access_token(access_token)
        return 1
    except Exception as e:
        return 0

