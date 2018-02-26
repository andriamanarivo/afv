export abstract class HomeApplicatifServiceACI {
    public abstract addOrVerifyPayment(data);
    public abstract  addDeleteRoleAbonne(action);
    public abstract rechercheAutocomplete(name : string);
    public abstract getFormRecherche();
    public abstract getListRecherche();
    public abstract recherche(data, min, max, order);
    public abstract getVisiteur(data, min, max, order);
    public abstract getHome(id: number);
    public abstract getHomes(page: number, size: number);
    public abstract getUserByCity(page: number, size: number, sortData?: any);
    public abstract getUserDetail(id: String);
    public abstract getUserConnecte();
    public abstract updateProfil(oUser);
    public abstract listePhoto(id: string, _public);
    public abstract ajouterPhoto(oPhoto);
    public abstract deletePhoto(data);
    public abstract editerPhotoProfil(data);
    public abstract updatePseudoEmail(pseudo: string, email: string);


    public abstract addFavoris(id: string);
    public abstract deleteFavoris(id: string);
    public abstract listeFavoris(uid: string, page: number, size: number, sortData?: any);
    public abstract create_Search(data);
    public abstract getAllSouscription();
    public abstract getSouscriptionDetail(id: string);
    public abstract create_Souscription(data);
    public abstract getOffres(id: any);
    public abstract createOffre(data: any);
    public abstract updateOffre(data: any);
    public abstract subscribeToOffer(data: any);
    public abstract resilierSouscription(data: any);
    public abstract renouvelerSouscription(data: any);
    public abstract getCurrentSouscription(uid: string);
    public abstract getUserSetting(uid: string);
    public abstract getBlackLlist(pseudo: string);
    public abstract getSetting();
    public abstract blacklist(uid: string, page: number, size: number);
    public abstract addToBlackList(uid: string);
    public abstract removeToBlackList(uid: string);
    public abstract checkinBlackList(pseudo: string);
    public abstract reportAbus(data: any);
    public abstract getAbus();
    public abstract getUserPdpUid(pseudo: string);
    public abstract getUserPdpUids(pseudos: Array<string>);
    public abstract getUserPdpPseudos(uids: Array<string>);
    public abstract getListGestionNotification();
    public abstract editStatutNotification(gestion);
    public abstract getNbVisiteurAndFavoris();
    public abstract subscribeNewsletter(uid: string, checked: boolean);
    public abstract removeSearch(search: any);
    public abstract getAllConnectedUsers();
    public abstract  refreshToken(data);
    public abstract addOrUpdateCodesPromo(data);
    public abstract getListCodesPromo(data);
    public abstract getDetailCodesPromo(data);

}
