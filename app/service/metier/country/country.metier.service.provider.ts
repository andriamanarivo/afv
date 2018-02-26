
import {
    CountryMetierServiceACI,
    CountryMetierService,
    CountryMetierServiceMock
} from '.';

export let CountryMetierServiceProvider = {
    provide: CountryMetierServiceACI,
    useClass: CountryMetierService
};

export let CountryMetierServiceMockProvider = {
    provide: CountryMetierServiceACI,
    useClass: CountryMetierServiceMock
};
