from jugaad_trader import Zerodha


def getConnection(userId, password, twofa, kite=Zerodha()):
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
