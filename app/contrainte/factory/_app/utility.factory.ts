import { Injectable } from '@angular/core';
@Injectable()

export class UtilityFactory {
    twoDigit(number: string) {
        if (number === undefined) {
          return number;
        }
        // console.log("before twoDigit : ", number);
        const twodigit = number.length === 2 ? number : '0' + number;
        // console.log("alter twoDigit", twodigit);
        return twodigit;
      }

      calculateAge(birthDay: string, birthMonth: string, birthYear: string): boolean {
        if (birthDay && birthMonth && birthYear) {
          const dateNaissance = birthYear + '-' + birthMonth + '-' + birthDay;
          const birthdate = Date.parse(dateNaissance);
          const nowdate = Date.now();
          const timeDiff = Math.abs(nowdate - birthdate);
          const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
          return age > 17 ;
        }
        return false;
      }

      isFutureDate(birthDay: string, birthMonth: string, birthYear: string): boolean {
        if (birthDay && birthMonth && birthYear) {
          const dateNaissance = birthYear + '-' + birthMonth + '-' + birthDay;
          const birthdate = Date.parse(dateNaissance);
          const nowdate = Date.now();
          const timeDiff = Math.abs(nowdate - birthdate);
          return timeDiff <= 0 ? true : false;
        }
        return true;
      }
}
