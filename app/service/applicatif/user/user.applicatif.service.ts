import { Injectable } from '@angular/core';
import { UserApplicatifServiceACI, UserApplicatifServiceMock } from '.';

@Injectable()
export class UserApplicatifService implements UserApplicatifServiceACI {
    private user = {
        isLoggedIn: true,
        user: { name: 'User', id: undefined }
    };
    public getUser(id: number) {
        this.user.user.id = id;
        return this.user;
    }

}
