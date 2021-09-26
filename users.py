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

    def buySellStock(self, tokenName, actionType):
        self.isOrdered = True
        x = self.placeOrder(tokenName, actionType)
        pprint(x)
        if (len(self.orderQueue) > 0):
            print("On added ")
            orderData = self.orderQueue.pop(0)
            self.buySellStock(orderData['tokenName'], orderData['actionType'])
        else:
            self.isOrdered = False

    def addOrderToOrderQueue(self, tokenName, actionType):
        orderData = {'tokenName': tokenName, 'actionType': actionType}
        self.orderQueue.append(orderData)
        if (self.isOrdered == False):
            print("On add")
            orderData = self.orderQueue.pop(0)
            self.buySellStock(orderData['tokenName'], orderData['actionType'])

    def placeOrder(self, tokenName, actionType):
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
                                          quantity=(25 * self.noOfLot),
                                          product='MIS',
                                          order_type='MARKET',
                                          validity='DAY')
            User.order_counter = User.order_counter + 1
            return "placed" + str(self.userName) + " Order ID is " + order_resp + " Counter " + str(User.order_counter)
        except Exception as e:
            error_mas = "Error while placing order of " + str(tokenName[1]) + " from " + str(self.userName)
            return error_mas + str(e)


usersList = []


# Balance checking and user validating
def isValidUserWithAmount(userId, userPass, userPin, noOfLot, userName):
    kiteobj = getConnection(userId, userPass, userPin)
    if (kiteobj == "e1"):
        print("Invalid Username Or Password", userName)
        return False
    elif (kiteobj == "e2"):
        print("Invalid Pin Number", userName)
        return False
    else:
        reqAmount = (noOfLot * 150000)
        availableAmount = int(kiteobj.margins()['equity']['available']['live_balance'])
        if (availableAmount >= reqAmount):
            return True
        else:
            print("less amount than required ", userName, " Available =", availableAmount, " Required =", reqAmount,
                  " Lots = ", noOfLot)
            return False


def setupAllUsersData():
    usersList.clear()
    usersData = getAlogUsersData()
    for userId, userData in usersData.items():
        password = userData['password']
        towAuth = userData['towAuth']
        noOfLot = userData['noOfLot']
        userName = userData['userName']
        usersList.append(User(userId, password, towAuth, noOfLot, userName))
    printAllUSerData()


def addUser(userId, password, towAuth, noOfLot, userName):
    usersList.append(User(userId, password, towAuth, noOfLot, userName))


def printAllUSerData():
    for user in usersList:
        user.printUserData()


def getUserCount():
    return len(usersList)


def getOrderCount():
    return User.order_counter


def buySellFromAllUser(token, actionType):
    for user in usersList:
        threading.Thread(target=user.addOrderToOrderQueue, args=(token, actionType)).start()



