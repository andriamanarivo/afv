import { UtilisateurCriteria } from '../../../donnee/utilisateur/utilisateur-criteria';
export abstract class UtilisateurApplicatifServiceACI {
    public abstract getUtilisateurs(userCriteria: UtilisateurCriteria);
    public abstract getUtilisateurDetail(idUser: string);
    public abstract verifySuspendedUser(uid: any);
    public abstract getStatutModeration();
    public abstract updateUserStatutModerisation(userId: string, idStatutModerisation: string);
    public abstract desactiveUsers(idUser: String, statutActivate: number);
    public abstract activeUsers(idUser: String);
    public abstract siteRoles(idSite: String);
    public abstract userRoles(idUser: String);
    public abstract updateUserRoles(idUser: string, roles);
}
