import {
    UserApplicatifServiceACI,
    UserApplicatifService,
    UserApplicatifServiceMock } from '.';

export let UserApplicatifServiceProvider = {
    provide: UserApplicatifServiceACI,
    useClass: UserApplicatifService
};

export let UserApplicatifServiceMockProvider = {
    provide: UserApplicatifServiceACI,
    useClass: UserApplicatifServiceMock
};
