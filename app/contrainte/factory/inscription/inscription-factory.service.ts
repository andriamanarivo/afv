import { Injectable } from '@angular/core';
import { Inscription, InscriptionData, InscriptionDto } from '../../../donnee/inscription';

@Injectable()
export class InscriptionFactory {
    constructor() { }

    inscriptionFromAny(inscription: any): Inscription {
        const currentIncription = new Inscription();
          // currentIncription.idsite = inscription.idsite;
          // currentIncription.sitename = inscription.sitename;
          currentIncription.id_vsetes = inscription.id_vsetes;
          currentIncription.id_statut = inscription.id_statut;
          currentIncription.id_orientation = inscription.id_orientation;
          currentIncription.id_situation = inscription.id_situation;
          currentIncription.id_tendance = inscription.id_tendance;
          currentIncription.id_pratique = inscription.id_pratique;
          currentIncription.id_recherche = inscription.id_recherche;
          currentIncription.email = inscription.email;
          currentIncription.pseudo = inscription.pseudo;
          currentIncription.pays = inscription.pays;
          currentIncription.ville = inscription.ville;
          currentIncription.lat = inscription.lat;
          currentIncription.lon = inscription.lon;
          currentIncription.date_naissance = inscription.date_naissance;
          currentIncription.date_naissance_c = inscription.date_naissance_c;
          currentIncription.password = inscription.password;
          currentIncription.passwordconfirm = inscription.passwordconfirm;
          currentIncription.obtin = inscription.obtin;
          return currentIncription;
    }
}
