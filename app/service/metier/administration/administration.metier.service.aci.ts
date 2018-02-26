export abstract class AdministrationMetierServiceACI {
    public abstract deleteUser(id: any);
    public abstract getThematiques();
    public abstract addUpdateThematique(thematique);
    public abstract deleteThematique(uid) ;
    public abstract getCouleur();
    public abstract addUpdateCouleur(couleur);
    public abstract deleteCouleur(uid);
    public abstract listAbus(page: number, size: number ,filtre: any);
    public abstract getDetailAbus(uid:string);
    public abstract performAction(data:any);
    public abstract listAbonnement(page: number, size: number);
    public abstract newAbonnement(uid);
    public abstract suspendAbonnent(uid);
    public abstract reprendreAbonnement(uid);
    public abstract listTerme(page: number, size: number);
    public abstract listTermes();
    public abstract createTerme(data:any);
    public abstract deleteTerme(idTerme: number);
    public abstract updateTerme(data:any);
    public abstract getSubscribedNewsletter();
    public abstract  getPhotos(criteria: any);
    public abstract  changeStatutModerationPhoto(idPhoto);
    public abstract  changeScopePhoto(idPhoto);
    public abstract  getDescriptions(criteria);
    public abstract  rejectDescription(id);
    public abstract  changeStatutModerationDescription(uid);
    public abstract  stopAbonnement(id);
    public abstract executeImport(data);
    public abstract getSqlData(data);
    public abstract getNameFileMigration(data);
    public abstract getNbFileMigration(data);
    public abstract acceptDescription(id);
    public abstract  getUserNotFound();
    public abstract  editPhoto(data);
    
}
