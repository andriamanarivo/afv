import { Injectable } from '@angular/core';

@Injectable()
export class PhotoPdp {
    constructor() {
    }

    public getPhotoPdp(slug: string) {
        const photos = [];
        if (slug) {
            const search = slug.trim();
            // console.log('+++++++++++++++++++ ', search);
            photos['hommeslug'] =  {  pdp : 'assets/img/profil/default-homme.png' };
            photos['femmeslug'] =  {  pdp : 'assets/img/profil/default-femme.png' };
            photos['transtravslug'] =  {  pdp : 'assets/img/profil/default-trans-trav.png' };
            photos['couplehslug'] =  {  pdp : 'assets/img/profil/default-couple.png' };
            photos['couplefbislug'] =  {  pdp : 'assets/img/profil/default-couple-less.png' };
            photos['couplehbislug'] =  {  pdp : 'assets/img/profil/default-Bi.png' };
            photos['couplebislug'] =  {  pdp : 'assets/img/profil/default-Bi.png' };
            photos['couplegayslug'] =  {  pdp : 'assets/img/profil/default-couple-gay.png' };
            photos['couplelesbienslug'] =  {  pdp : 'assets/img/profil/default-couple-less.png' };
            return photos[search];
        } else {
            // return 'assets/img/profil-default.png';
            return {  pdp : 'assets/img/profil/default-couple-less.png' };
        }
    }
// tslint:disable-next-line:eofline
}