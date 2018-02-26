export class InscriptionDto {
    constructor(
        idsite: number,
        sitename: string,
        id_vsetes: number,
        id_statut: number,
        id_orientation: number,
        id_situation: number,
        id_tendance: number,
        id_pratique: number,
        id_recherche: number,
        
        email: string,
        pseudo: string,
        pays: string,
        ville: string,
        lat : string,
        lon: string,
        // apparence: string,
        date_naissance: string,
        date_naissance_c: string,
        
        password: string,
        passwordconfirm: string,
        obtin: boolean,

    ) {}
}