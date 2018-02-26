import { ConnectivityService } from '../../../commun/connectivity.service';

/*export let ContactMetierServiceFactory = (connectivityService: ConnectivityService,
    contactMetierLocalService: ContactMetierLocalService,
    ContactMetierRemoteService: ContactMetierRemoteService) => {

    if (connectivityService.getIsOnline()) {
        return ContactMetierRemoteService;
    } else {
        return contactMetierLocalService;
    }
};*/

export function HomeMetierServiceFactory ()  {

};
