
import {
    AdministrationMetierServiceACI,
    AdministrationMetierService,
    AdministrationMetierServiceMock
} from '.';

export let AdministrationMetierServiceProvider = {
    provide: AdministrationMetierServiceACI,
    useClass: AdministrationMetierService
};

export let AdministrationMetierServiceMockProvider = {
    provide: AdministrationMetierServiceACI,
    useClass: AdministrationMetierServiceMock
};
