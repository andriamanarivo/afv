import { Injectable } from '@angular/core';
import { UserApplicatifServiceACI } from '.';

@Injectable()
export class UserApplicatifServiceMock implements UserApplicatifServiceACI {

    private user = {
        isLoggedIn: true,
        user: { name: 'Test User Stub', id: undefined },
    };

    public getUser(id: number) {
        this.user.user.id = id;
        return this.user;

    }

}
