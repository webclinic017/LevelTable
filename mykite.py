from jugaad_trader import Zerodha


def getDataConnection(userId, password, twofa, kite=Zerodha()):
    kite.user_id = userId
    kite.password = password
    loginPros = kite.login_step1()
    if loginPros['status'] == 'error':
        return "e1"
    kite.twofa = twofa
    loginPros = kite.login_step2(loginPros)
    if loginPros['status'] == 'error':
        return "e2"
    kite.enc_token = kite.r.cookies['enctoken']
    return kite


def getConnection(userId, password, twofa):
    user_kite = Zerodha()
    user_kite.user_id = userId
    user_kite.password = password
    loginPros = user_kite.login_step1()
    if loginPros['status'] == 'error':
        return "e1"
    user_kite.twofa = twofa
    loginPros = user_kite.login_step2(loginPros)
    if loginPros['status'] == 'error':
        return "e2"
    user_kite.enc_token = user_kite.r.cookies['enctoken']
    return user_kite
