
import {
    AuthenticationMetierServiceACI,
    AuthenticationMetierService,
    AuthenticationMetierServiceMock
} from '.';

export let AuthenticationMetierServiceProvider = {
    provide: AuthenticationMetierServiceACI,
    useClass: AuthenticationMetierService
};

export let AuthenticationMetierServiceMockProvider = {
    provide: AuthenticationMetierServiceACI,
    useClass: AuthenticationMetierServiceMock
};
