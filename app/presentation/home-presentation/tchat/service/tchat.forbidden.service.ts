import { Injectable } from '@angular/core';

declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Injectable()
export class TchatForbiddenService {
    constructor(
    ) {

    }

    isMessageExcluded(sentText, tchatsForbidden) {
        let hasExcludedMessage =  {
            excluded: false,
            message : []
        };
        if (sentText !== '') {
            const pseudo = sentText;
            const pseudoLower = pseudo.toLocaleLowerCase();
            /* const exludedFilter = tchatsForbidden.findIndex(excluded =>
                pseudoLower.indexOf(excluded.value.trim().toLocaleLowerCase()) !== -1); */

            const exludedFilter = tchatsForbidden.filter(excluded =>
                    pseudoLower.includes(excluded.value.trim().toLocaleLowerCase()));

            // console.log('excluded', exludedFilter, tchatsForbidden);
            /* if (exludedFilter.length !== -1) {
                hasExcludedMessage =  {
                    excluded: true,
                    message : tchatsForbidden[exludedFilter].value
                };
            } */

            hasExcludedMessage =  {
                excluded:  exludedFilter.length > 0,
                message : exludedFilter
            };

        }
        return hasExcludedMessage;
    }

    /* isMessageExcluded(sentText, tchatsForbidden) {
        let isInvalidMessage = false;
        if (sentText !== '') {
            const pseudo = sentText;
            const pseudoLower = pseudo.toLocaleLowerCase();
            isInvalidMessage = tchatsForbidden.some(it => pseudoLower.indexOf(it.value.trim().toLocaleLowerCase()) !== -1);
            const exludedFilter = tchatsForbidden.findIndex(excluded =>
                pseudoLower.indexOf(excluded.value.trim().toLocaleLowerCase()) !== -1);

            console.log('excluded', exludedFilter, tchatsForbidden);

        }
        if (isInvalidMessage) {
          return true;
        }
        return false;
    } */
}
