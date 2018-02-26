export abstract class AuthenticationApplicatifServiceACI {
    public abstract login(email: string, password: string, ip: string);
    public abstract completeAndLog(data);

    public abstract logout();
    public abstract loggedIn();

    public abstract parsetoken();

    public abstract confirmResetPassword(user: String, code: String, sentDate: String, password: String, idSite: String);
    public abstract resetPassword(user, idSite: String);
    public abstract resetPseudoOrMail(idUser: String , PseudoNotMail: boolean);
    public abstract updateConnectionStatus(isConnected: String);
    public abstract sendToken();

}
