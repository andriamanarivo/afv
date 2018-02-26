import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AutorisationService {
  constructor(private jwtHelper: JwtHelper) { }
  getAutorisation(): any {
    const  autorisations: any = [];
    const token = sessionStorage.getItem('id_token');
    const currentUser = this.jwtHelper.decodeToken(token);
    for (const i in currentUser.autorisations) {
      if (currentUser.autorisations.hasOwnProperty(i)) {
        autorisations[currentUser.autorisations[i]] = true;
      }
    }
    return autorisations;
  }
}
