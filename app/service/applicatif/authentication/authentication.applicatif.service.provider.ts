import {
    AuthenticationApplicatifServiceACI,
    AuthenticationApplicatifService,
    AuthenticationApplicatifServiceMock
} from '.';


export let AuthenticationApplicatifServiceProvider = {
    provide: AuthenticationApplicatifServiceACI,
    useClass: AuthenticationApplicatifService
};

export let AuthenticationApplicatifServiceMockProvider = {
    provide: AuthenticationApplicatifServiceACI,
    useClass: AuthenticationApplicatifServiceMock
};