import { Injectable } from '@angular/core';
import { HomeApplicatifServiceACI } from 'app/service/applicatif/home';
import { DataProfil } from 'app/donnee/home/dataProfil';
import { SharedService } from 'app/commun';

@Injectable()
export class UtilsService {
    constructor(
        private homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private sharedService: SharedService
    ) { }

    setConnectedUsers(users: any): void {
        this.sharedService.allConnectedUsers.subscribe(res => {
            if (res && Array.isArray(res)) {
                if (users) {
                    users.map(user => {
                        user.isConnected = res.find(u => { return u.username === user.id });
                    });
                }
            } else if (res) {
                users && users.map(user => user.isConnected = (res['username'] === user.id));
            }
            //console.log(users);
        });
    }

    capitalizeFirstLetter(text: string) {
        if (text) {
            text = text.toLowerCase();
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    }

    completedProfilPercent(userConnect) {
        let nbField = 0;
        DataProfil.forEach(field => {           
            if (this.notEmpty(userConnect[field])) {
                nbField++;
            }
        });
        let percent = 0;
        percent = nbField * 100 / DataProfil.length;      
        this.sharedService.stateProfil.next(Math.round(percent));
        return Math.round(percent);
    }

    notEmpty(data: any): boolean {
        if (typeof data === "object" && data){
            return this.notEmpty(data['uid']);
        }else{
            return (data && data !== undefined && data !== '' && data !== null && data.length !== 0);
        }

    }

}
