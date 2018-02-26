import { Injectable } from '@angular/core';

@Injectable()
export class ConnectivityService {

    private isOnline: Boolean = true;
    public getIsOnline() {
        return this.isOnline;
    }

    public setIsOnline(value: Boolean) {
        this.isOnline = value;
    }

}
