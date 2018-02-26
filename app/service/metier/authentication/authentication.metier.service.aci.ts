export abstract class AuthenticationMetierServiceACI {
    public abstract login(email: string, password: string, ip: string);
    public abstract completeAndLog(data);
    public abstract confirmResetPassword(user: String, code: String, sentDate: String, password: String, idSite: String);
    public abstract resetPassword(user , idSite: String);
    public abstract resetPseudoOrMail(idUser: String , PseudoNotMail: boolean);
    public abstract updateConnectionStatus(isConnected: String);
    public abstract sendToken();
}