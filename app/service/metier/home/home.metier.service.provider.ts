
import { HomeMetierServiceACI , HomeMetierServiceMock , HomeMetierService } from '.';

export let HomeMetierServiceProvider = {
    provide: HomeMetierServiceACI,
    useClass: HomeMetierService
};
export let HomeMetierServiceMockProvider = {
    provide: HomeMetierServiceACI,
    useClass: HomeMetierServiceMock
};