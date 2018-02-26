import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { environment } from '../../../../environments/environment';
import { SouscriptionDatas } from '../../../donnee/home/mock-listeSouscription';
import { mesOffres } from '../../../donnee/home/mock-listeSouscription';


@Injectable()
export class HomeRest {

    // let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });

    // let options = new RequestOptions({ headers: headers });


    // private headers = new Headers({ 'Content-Type': 'application/json' });
    baseUrlAppUrl: string;
    baseUrlApp: string;
    allPlanFamilleUrl: string;
    familleGeneraleUrl: string;
    baseUrlFront: string;

    constructor(private authHttp: AuthHttp,
        private http: Http,
        private appConfig: AppConfig) {
        this.baseUrlApp = environment.baseUrlAppUrl;
        this.baseUrlFront = environment.baseUrlFront;
    }
    refreshToken(data){
        const url = this.baseUrlApp + 'refresh/token';
        return this.authHttp.post(url, data);
    }

    getAllConnectedUsers(){
        const url = environment.OpenfireChatApiRest + "sessions";
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + environment.basicAuthorization);
        return this.http.get(url, {headers: headers}); 
    }

    removeSearch(search:any){     
        const url = this.baseUrlApp + 'api/recherche/delete';
        const data = {uidSearch:search.uidSearch}
        return this.authHttp.post(url, data);
        //return this.authHttp.get(url);
    }


    // getSiteByLocation():  string {
    //     let envLocation = window.location.hostname;

    //     switch (envLocation) {
    //         case this.appConfig.getConfig("site1.sitename"):
    //             return this.appConfig.getConfig("site1.Id")
    //             case this.appConfig.getConfig("site2.sitename"):
    //             return this.appConfig.getConfig("site2.Id");
    //             case this.appConfig.getConfig("site3.sitename"):
    //             return this.appConfig.getConfig("site3.Id");
    //         default:
    //             return this.appConfig.getConfig("site4.Id")
    //     }
    // }

    getNbVisiteurAndFavoris(){
        // /api/getNbForHomePage
        let url = this.baseUrlApp + 'api/getNbForHomePage';
        return this.authHttp.get(url);

    }
    rechercheAutocomplete(name: string): Observable<Response> {
        const Url = this.baseUrlApp + 'api/auto_complete_pseudo/'+name;

        return this.authHttp.get(Url);
    }

    addDeleteRoleAbonne(data){
        let url = '';
        url = this.baseUrlApp +'api/admin/roles';
        // if(action == 'add'){
        //     url = this.baseUrlApp +'api/addRoleAbonne'
        // }
        // if(action == 'delete'){
        //     url = this.baseUrlApp +'api/deleteRoleAbonne';
        // }
        return this.authHttp.post(url, data);
    }
    getListRecherche(): Observable<Response> {
        const url = this.baseUrlApp + 'api/recherche/liste';
        return this.authHttp.get(url);
    }
    getFormRecherche(): Observable<Response> {
        const url = this.baseUrlApp + 'recherche/formulaire';
        return this.authHttp.get(url);
    }
    recherche(data, min, max, sortData): Observable<Response> {
        let url = this.baseUrlApp + 'api/search?first=' + min + '&max=' + max;
        if (sortData && sortData.order) {
             url = this.baseUrlApp + 'api/search?first=' + min + '&max=' + max + '&order=' + sortData.order;
        }
        if (data.postRequest) {
            return this.authHttp.post(url, data);
        } else {
            return this.authHttp.get(url);
        }
    }
    getVisiteur(data, min , max , order): Observable<Response>{
        let url;
        if (order && order !== '') {
            url = this.baseUrlApp + 'api/list/visiteur?first=' + min + '&max=' + max + '&order=' + order;
        } else {
            url = this.baseUrlApp + 'api/list/visiteur?first=' + min + '&max=' + max;
        }
        return this.authHttp.get(url);
    }

    getHomes(page: number, size: number): Observable<Response> {
        const env = this.appConfig.getSiteIdByLocation();
        // let env =  this.getSiteByLocation();
        const url = this.baseUrlApp + 'api' + '/list/interessant?first=' + page + '&max=' + size;
        return this.authHttp.get(url);
    }

    getUserByCity(page: number, size: number, sortData?: any): Observable<Response> {
        const env = this.appConfig.getSiteIdByLocation();
        /* let url = this.baseUrlApp + 'api' + '/list/samecity?first=' + page + '&max=' + size;
        if(sortData) url = this.baseUrlApp + 'api' +
            '/list/samecity?first=' + page + '&max=' + size + "&order=" + sortData.order + "&desc=" + sortData.desc; */

        let url = this.baseUrlApp + 'api' + '/left_list?first=' + page + '&max=' + size;
        if (sortData) {
            url = this.baseUrlApp + 'api' + '/left_list?first=' +
            page + '&max=' + size + '&order=' + sortData.order + '&desc=' + sortData.desc;
        }
        return this.authHttp.get(url);
    }

    getUserConnecte(): Observable<Response> {
        const env = this.appConfig.getSiteIdByLocation();
        // let env = this.getSiteByLocation();        
        const url = this.baseUrlApp + 'api' + '/gestion/profile';
        return this.authHttp.get(url);

    }

    getUserDetail(id: String): Observable<Response> {
        const env = this.appConfig.getSiteIdByLocation();
        // let env = this.getSiteByLocation();
        const url = this.baseUrlApp + 'api/' + id + '/utilisateur';
        return this.authHttp.get(url);
    }

    updateProfil(oUser) {
        console.log('user', oUser);        
        const url = this.baseUrlApp + 'api' + '/gestion/profile';
        return this.authHttp.put(url, oUser);
    }

    updatePseudoEmail(pseudo: string, email: string){
        const url = this.baseUrlApp + 'api' + '/mailPseudo';
        const data = {
            'pseudo': pseudo,
            'email': email,
            'lien': this.baseUrlFront + '/inscription/renderMailConfirm'
        };

        return this.authHttp.put(url, data);
    }

    deleteProfil() {

    }
    listePhoto(id: string, _public) {
        const url = this.baseUrlApp + 'api/utilisateurs/getPhotos/' + _public + '/' + id; ;
        return this.authHttp.get(url);
    }
    addOrVerifyPayment(data) {
        const url = this.baseUrlApp + 'api/payment/execute/register';
        return this.authHttp.post(url, data);
    }
    ajouterPhoto(oPhoto) {
        const url = this.baseUrlApp + 'api' + '/utilisateur/ajout_photo';
        return this.authHttp.post(url, oPhoto);
    }
    deletePhoto(data) {
        let url = this.baseUrlApp + 'api/utilisateurs/delete_photo';
        if(data.uid){
            url = this.baseUrlApp + 'api/utilisateurs/delete_photo/' + data.uid;
        }
        return this.authHttp.post(url, data);
    }
    editerPhotoProfil(data) {
        const url = this.baseUrlApp + 'api/utilisateurs/editPhotoProfile';
        return this.authHttp.post(url, data);
    }
    addFavoris(id: string) {
        const url = this.baseUrlApp + 'api/' + id + '/favoris';
        // console.log("url add",url);
        return this.authHttp.post(url, null);
    }
    deleteFavoris(id: string) {
        const url = this.baseUrlApp + 'api/' + id + '/favoris';
        // console.log("delete url",url);
        return this.authHttp.delete(url);
    }
    listeFavoris(uid: string, page: number, size: number,  sortData?: any): Observable<Response> {
        let url = this.baseUrlApp + 'api/' + uid + '/list/favoris?first=' + page + '&max=' + size;
        if (sortData) {
            url = this.baseUrlApp + 'api/' + uid + '/list/favoris?first=' + page +
            '&max=' + size + '&order=' + sortData.order + '&desc=' + sortData.desc;
        }
        return this.authHttp.get(url);
    }
    blacklist(uid: string, page: number, size: number): Observable<Response> {
        const blackListUrl = this.baseUrlApp + 'api/' + uid + '/list/blackList?first=' + page + '&max=' + size;
        return this.authHttp.get(blackListUrl);
    }
    create_Search(data) {
        const url = this.baseUrlApp + 'api/recherche/create_update';
        return this.authHttp.post(url, data);
    }
    getOffres(data: any) {
        let allOffresUrl = this.baseUrlApp + 'api/offres';
        if (data instanceof Object) {
            allOffresUrl = this.baseUrlApp + 'api/offres' + '?first=' + data.first + '&max=' + data.max;
        }
        return this.authHttp.get(allOffresUrl);
    }
    getSouscriptionDetail(id: string) {
        return Observable.of(SouscriptionDatas);
    }
    getAllSouscription() {
        return null;
    }
    create_Souscription(data) {
        return null;
    }

    subscribeToOffer(data: any) {
        const souscriptionUrl = this.baseUrlApp + 'api/offre/souscrire';
        return this.authHttp.post(souscriptionUrl, data);
    }

    resilierSouscription(data: any) {
        const resiliationUrl = this.baseUrlApp + 'api/offre/resilier';
        return this.authHttp.post(resiliationUrl, data);
    }

    renouvelerSouscription(data) {
          const renouvelementOffreUrl = this.baseUrlApp + 'api/offre/renouveler';
        return this.authHttp.post(renouvelementOffreUrl, data);
    }

    getCurrentSouscription(uid: string) {
        const currentSouscriptionUrl = this.baseUrlApp + 'api/utilisateur/' + uid + '/souscriptions';
        // return Observable.of(SouscriptionDatas);
        return this.authHttp.get(currentSouscriptionUrl);
    }

    getUserSetting(uid: string) {
        return this.authHttp.get('assets/mock/setting.json');
    }

    getBlackLlist(pseudo: string) {
        const blackListUrl = this.baseUrlApp + 'api/' + pseudo + '/list/blackList';
        return this.authHttp.get(blackListUrl);
    }

    getSetting() {
        const settingUlr = this.baseUrlApp + 'api/parametre';
        return this.authHttp.get(settingUlr);
    }

    addToBlackList(uid: string) {
        const data = {pseudo: uid};
        const addToBlacklistUrl = this.baseUrlApp + 'api/addBlackList';
        return this.authHttp.post(addToBlacklistUrl, data);
    }

    removeToBlackList(uid: string) {
        const data = {pseudo: uid};
        const removeToBlacklistUrl = this.baseUrlApp + 'api/delete/blackList';
        return this.authHttp.post(removeToBlacklistUrl, data);
    }

    checkinBlackList(pseu: string) {
        const checkUrl = this.baseUrlApp + 'api/isBlackList';
        const data = {pseudo: pseu};
        return this.authHttp.post(checkUrl, data);
    }

    reportAbus(data: any) {
        const idSite = this.appConfig.getSiteIdByLocation();
        data.idSite = idSite;
        console.log(data);
        const reportAbusUlr = this.baseUrlApp + 'api/addUpdateAbus';
        return this.authHttp.post(reportAbusUlr, data);
    }

    getAbus() {
        return this.authHttp.get('assets/mock/abus.json');
    }

    getUserPdpUid(pseudo: string) {
        const checkUrl = this.baseUrlApp + 'api/getPdpUid';
        const data = {pseudo: pseudo};
        return this.authHttp.post(checkUrl, data);
    }

    getUserPdpUids(pseudos: Array<string>) {
        const checkUrl = this.baseUrlApp + 'api/getPdpUids';
        const data = {pseudos: pseudos};
        return this.authHttp.post(checkUrl, data);
    }

    getUserPdpPseudos(uids: Array<string>) {
        const checkUrl = this.baseUrlApp + 'api/getPdpPseudos';
        const data = {uids: uids};
        return this.authHttp.post(checkUrl, data);
    }

    getListGestionNotification() {
        const checkUrl = this.baseUrlApp + 'api/getAllNotif';
        return this.authHttp.get(checkUrl);
    }

    editStatutNotification(gestion) {
        const checkUrl = this.baseUrlApp + 'api/addNotifUser';
        const data = [{
            id: gestion.id,
            libelle: gestion.libelle,
            ischecked: gestion.isChecked === true ? 1 : 0
        }];

        return this.authHttp.post(checkUrl, data);
    }

    createOffre(data) {
        const Url = this.baseUrlApp + 'api/createOffre';
        return this.authHttp.post(Url, data);
    }

    updateOffre(data) {
        const Url = this.baseUrlApp + 'api/updateOffre';
        return this.authHttp.post(Url, data);
    }

    subscribeNewsletter(id, checked){
        const Url = this.baseUrlApp + 'api/newsletter/subscribe';
        const data = {uid: id, ischecked: checked};
        return this.authHttp.post(Url, data);
    }

    addOrUpdateCodesPromo(data){
        const Url = this.baseUrlApp + 'api/admin/codepromo';
        return this.authHttp.post(Url, data);
    }

    getListCodesPromo(data){
        const Url = this.baseUrlApp + 'api/admin/codepromo?max='+ data.max +'&first='+data.first;
        return this.authHttp.get(Url);
    }
    getDetailCodesPromo(data){
        const Url = this.baseUrlApp + 'api/admin/codepromo/detail';
        return this.authHttp.post(Url,data);
    }
}