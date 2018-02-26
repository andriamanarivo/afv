import {
    HomeApplicatifServiceACI,
    HomeApplicatifService,
    HomeApplicatifServiceMock
} from '.';
export let HomeApplicatifServiceProvider = {
    provide: HomeApplicatifServiceACI,
    useClass: HomeApplicatifService
};

export let HomeApplicatifServiceMockProvider = {
    provide: HomeApplicatifServiceACI,
    useClass: HomeApplicatifServiceMock
};
