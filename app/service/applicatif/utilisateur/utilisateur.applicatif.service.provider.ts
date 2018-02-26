import {
    UtilisateurApplicatifServiceACI,
    UtilisateurApplicatifService,
    UtilisateurApplicatifServiceMock
} from '.';


export let UtilisateurApplicatifServiceProvider = {
    provide: UtilisateurApplicatifServiceACI,
    useClass: UtilisateurApplicatifService
};


export let UtilisateurApplicatifServiceMockProvider = {
    provide: UtilisateurApplicatifServiceACI,
    useClass: UtilisateurApplicatifServiceMock
};