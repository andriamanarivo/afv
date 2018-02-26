import { Injectable } from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Injectable()
export class PasswordValidationService {

  constructor() { }
  // https://scotch.io/@ibrahimalsurkhi/match-password-validation-with-angular-2

  // tslint:disable-next-line:member-ordering
  static MatchPassword(AC: AbstractControl) {
       const password = AC.get('password').value; // to get value in input tag
       const confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
        if (password !== confirmPassword) {
            // console.log('false');
            // AC.get('confirmPassword').setErrors( {MatchPassword: true} )
            return { 'noMatchPassword': true };
        } else {
            // console.log('true');
            return null;
        }
    }

}
