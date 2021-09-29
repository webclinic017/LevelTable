import threading
from pprint import pprint
from mykite import *


class User:
    order_counter = 0

    def __init__(self, userId, password, towAuth, noOfLot, userName):
        self.userId = userId
        self.password = password
        self.towAuth = towAuth
        self.noOfLot = noOfLot
        self.userName = userName
        self.orderQueue = []
        self.isOrdered = False

    def printUserData(self):
        print("Name :", self.userName, "| UserId :", self.userId, "| TowAuth :", self.towAuth, "| Password :",
              self.password)

    def buySellStock(self, tokenName, actionType, qty):
        self.isOrdered = True
        x = self.placeOrder(tokenName, actionType, qty)
        pprint(x)
        if (len(self.orderQueue) > 0):
            print("On added ")
            orderData = self.orderQueue.pop(0)
            self.buySellStock(orderData['tokenName'], orderData['actionType'], orderData['qty'])
        else:
            self.isOrdered = False

    def addOrderToOrderQueue(self, tokenName, actionType, qty):
        orderData = {'tokenName': tokenName, 'actionType': actionType, 'qty': qty}
        self.orderQueue.append(orderData)
        if (self.isOrdered == False):
            print("On add")
            orderData = self.orderQueue.pop(0)
            self.buySellStock(orderData['tokenName'], orderData['actionType'], orderData['qty'])

    def placeOrder(self, tokenName, actionType, qty):
        tokenName = tokenName.split(":")
        try:
            kite = getConnection(self.userId, self.password, self.towAuth)
            if (kite == "e1" or kite == "e2"):
                print("Wrong password or pin in ", self.userId)
                return
            order_resp = kite.place_order(variety='regular',
                                          exchange=tokenName[0],
                                          tradingsymbol=tokenName[1],
                                          transaction_type=actionType,
                                          quantity=(qty * self.noOfLot),
                                          product='MIS',
                                          order_type='MARKET',
                                          validity='DAY')
            User.order_counter = User.order_counter + 1
            return "placed" + str(self.userName) + " Order ID is " + order_resp + " Counter " + str(User.order_counter)
        except Exception as e:
            error_mas = "Error while placing order of " + str(tokenName[1]) + " from " + str(self.userName)
            return error_mas + str(e)


usersList = {}


def addUser(userId, password, towAuth, noOfLot):
    try:
        kiteObj = getConnection(userId, password, towAuth)
        if kiteObj == "e1" or kiteObj == "e2":
            return {'status': 0, 'error': "Invalid Username Or password"}
        userName = kiteObj.profile()['user_shortname']
        usersList[userId] = User(userId, password, towAuth, noOfLot, userName)
        print(type(usersList))
        printAllUSerData()
        return {'status': 1, 'name': userName, 'id': userId, 'password': password, 'pin': towAuth, 'lot': noOfLot}
    except Exception as e:
        return {'status': 0, 'error': str(e)}


def removeUser(userId):
    try:
        del usersList[userId]
        printAllUSerData()
        return {'status': 1, 'id': userId}
    except Exception as e:
        return {'status': 0, 'error': str(e)}


def printAllUSerData():
    if len(usersList) == 0:
        print("User List is Empty")
    for user in list(usersList):
        usersList[user].printUserData()

#Name : Brijesh | UserId : QU1776 | TowAuth : 296177 | Password : Zerodha@177._

def getUserCount():
    return len(usersList)


def getOrderCount():
    return User.order_counter


def buySellFromAllUser(token, actionType, qty):
    for user in list(usersList):
        threading.Thread(target=usersList[user].addOrderToOrderQueue, args=(token, actionType, qty)).start()
