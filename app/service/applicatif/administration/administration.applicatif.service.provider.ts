import {
    AdministrationApplicatifServiceACI,
    AdministrationApplicatifService,
    AdministrationApplicatifServiceMock
} from '.';


export let AdministrationApplicatifServiceProvider = {
    provide: AdministrationApplicatifServiceACI,
    useClass: AdministrationApplicatifService
};

export let AdministrationApplicatifServiceMockProvider = {
    provide: AdministrationApplicatifServiceACI,
    useClass: AdministrationApplicatifServiceMock
};