from login import *
from pprint import pprint
import json

# make_zerodha_login('FPR292', 'Zerodha2@2@', '100599')

def getTokenNumber(token):
    return str(kite.ltp(token)[token]['instrument_token'])

def getTimeStr(timeframe):
    if(timeframe==1):
        return 'minute'
    else:
        return str(timeframe)+'minute'

# ============== Candle And Level Data ====================
def getCandleData(exeToken,timeNum,candleTimeStr):
    try:
        print(exeToken,timeNum,candleTimeStr)
        timeframe = getTimeStr(timeNum)
        candleTime = datetime.datetime.fromisoformat(candleTimeStr)
        candleTimeEnd = candleTime+datetime.timedelta(minutes= timeNum)
        token = getTokenNumber(exeToken)
        pre_data = kite.historical_data(instrument_token=token, from_date=candleTime, to_date=candleTimeEnd,interval=timeframe, continuous=False, oi=False)
        dataObj = {}
        dataObj['date'] = str(pre_data[0]['date']).split(' ')[0]
        dataObj['candleTime'] = str(pre_data[0]['date']).split(' ')[1][0:-9]
        dataObj['open'] = round(float(pre_data[0]['open']),2)
        dataObj['high'] = round(float(pre_data[0]['high']),2)
        dataObj['low'] = round(float(pre_data[0]['low']),2)
        dataObj['close'] = round(float(pre_data[0]['close']),2)
        candleRange = dataObj['high']-dataObj['low']
        lvl1 = candleRange*0.382
        lvl2 = candleRange*0.618
        dataObj['b1'] = round(float(pre_data[0]['close'])+lvl1,2)
        dataObj['b2'] = round(float(pre_data[0]['close'])+lvl2,2)
        dataObj['s1'] = round(float(pre_data[0]['close'])-lvl1,2)
        dataObj['s2'] = round(float(pre_data[0]['close'])-lvl2,2)
        dataObj['status'] = 1
        return json.dumps(dataObj)
    except Exception as e:
        dataObj = {}
        dataObj['status'] = 0
        dataObj['error'] = str(e)
        return json.dumps(dataObj)


# print(getCandleData('NFO:BANKNIFTY2191636700PE',15,'2021-09-09 09:15'))
