import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// import * as CryptoJS from 'crypto-js';
import {AES, enc} from 'crypto-js';
/* declare const CryptoJS; */
/* import * as CryptoJS from "crypto-js/crypto-js"; */



@Injectable()
export class CryptionAesService {
    private SECRET_KEY = 'bdm secret key aes';
    decryptMessage(message) {
        if (message) {
            const bytes  = AES.decrypt(message, this.SECRET_KEY);
            const decrypted = bytes.toString(enc.Utf8);
            return decrypted;
        }
        return null;
    }

    cryptMessage(message: string) {
        const encrypted = AES.encrypt(message, this.SECRET_KEY);
        return encrypted;
    }

    cryptToLocaleStorage(key: string, value: string) {
        const encrypted = AES.encrypt(value, this.SECRET_KEY);
        return encrypted;
    }
}
