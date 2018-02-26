import { Injectable } from '@angular/core';

import { UtilisateurDto, UtilisateurDo } from '../../../donnee/utilisateur';

@Injectable()
export class UtilisateurFactory {
    constructor() { }

    utilisateurDtoFromDo(utilisateurDo): UtilisateurDto {
        return new UtilisateurDto(
            utilisateurDo.id,
        utilisateurDo.email,
        utilisateurDo.pseudo,
        utilisateurDo.ville,
        utilisateurDo.departement,
        utilisateurDo.description,
        utilisateurDo.dateNaissance,
        utilisateurDo.dateNaissanceC,
        utilisateurDo.age,
        utilisateurDo.ageC,
        utilisateurDo.origine,
        utilisateurDo.experience,
        utilisateurDo.mobilite,
        utilisateurDo.disponibilite,
        utilisateurDo.isActive,
        utilisateurDo.site,
        utilisateurDo.vetes,
        utilisateurDo.statut,
        utilisateurDo.orientation,
        utilisateurDo.situation,
        utilisateurDo.tendance,
        utilisateurDo.recherche
        );
    }

    utilisateursDtoFromDo(utilisateurDos: UtilisateurDto[]): UtilisateurDto[] {
        return utilisateurDos.map(utilisateurDo => this.utilisateurDtoFromDo(utilisateurDo));
    }
}
