
import {
    UtilisateurMetierServiceACI,
    UtilisateurMetierService,
    UtilisateurMetierServiceMock
} from '.';

export let UtilisateurMetierServiceProvider = {
    provide: UtilisateurMetierServiceACI,
    useClass: UtilisateurMetierService
};

export let UtilisateurMetierServiceMockProvider = {
    provide: UtilisateurMetierServiceACI,
    useClass: UtilisateurMetierServiceMock
};
