import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import {AbstractControl} from '@angular/forms';


@Injectable()
export class ValidationService {

  constructor(private translate: TranslateService) {


  }

    // tslint:disable-next-line:member-ordering
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {

        const config = {
            'firstMustBeLetter' : 'firstMustBeLetter',
            'invalidAccent' : 'invalidAccent',
            'invalidCodePays' : 'invalidCodePays',
            // 'invalidCreditCard': 'invalidCreditCard',//'Is invalid credit card number',         
            'invalidEmailAddress': 'invalidEmailAddress', // 'Invalid email address',
            'invalidMonth' : 'invalidMonth',
            'invalidDay' : 'invalidDay',
            'invalidPassword': 'invalidPassword',
            'invalidPseudo' : 'invalidPseudo',
            'invalidspecialChar' : 'invalidspecialChar',
            'invalidYear': 'invalidYear',
            'mailNotAutorized' : 'mailNotAutorized',
            'minorMessage' : 'minorMessage',
            'minorNotAutorized' : 'minorNotAutorized',
            'invalidNumeric' : 'invalidNumeric',
            'invalidPhone' : 'invalidPhone',
            'noMatchPassword' : 'noMatchPassword',
            'pseudoNotAutorized' : 'pseudoNotAutorized',
            'required': 'Required',
            'invalidLength' : 'invalidLength',
            'premierAlphabetInvalid' : 'premierAlphabetInvalid',
            'minlength': `Minimum length ${validatorValue.requiredLength}`
        };
        // console.log('aeaeaze', config[validatorName]);
        return !config[validatorName] ? validatorName : config[validatorName];
    }

    // tslint:disable-next-line:member-ordering
    static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        // tslint:disable-next-line:max-line-length
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
                if (control.value.length===19) {
                    return null; 
                }else{
                    return { 'invalidCreditCard': true };
                }
        }
    }

    // tslint:disable-next-line:member-ordering
    static emailValidator(control) {
        // RFC 2822 compliant regex
        // tslint:disable-next-line:max-line-length
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static emailNotRequiredValidator(control) {
        // RFC 2822 compliant regex
        // tslint:disable-next-line:max-line-length
        if (control.value === '' || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }
    // tslint:disable-next-line:member-ordering
    static dateValValidator(control) {
        const germanDatePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

        const frenchDatePattern = /^(0[1-9]|1[012])[- /.]\d\d$/ ;
        if (control.value && control.value.match(frenchDatePattern)) {
            const dateToformat = control.value ? control.value.split('/') : '';
            // console.log(+dateToformat[2]);

            const date = new Date();
            if (date.getFullYear() - 2000 > dateToformat[1])
            {
                return { 'datePerime': true };
            } else{
                if (date.getFullYear() - 2000 === dateToformat[1]) {
                    if ((date.getMonth() + 1) <= dateToformat[0]) {
                        return null;
                    } else {
                        return { 'datePerime': true };
                    }
                } else{
                    return null;
                }
            }

        } else {
            return { 'invalidDate': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static dateValidator(control) {
        const germanDatePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

        const frenchDatePattern = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/ ;
        if (control.value && control.value.match(frenchDatePattern)) {
            const dateToformat = control.value ? control.value.split('/') : '';

            switch (+dateToformat[0]) {
            case 2:
                return +dateToformat[1] > 28 ? { 'invalidDate': true } : null;
                case 4:
                case 6:
                case 9:
                case 11:
                return +dateToformat[1] > 30 ? { 'invalidDate': true } : null;
        }

            return null;
        } else {
            return { 'invalidDate': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static customDateValidator(control) {
        if (control.value ) {
            // let datecontrol = control.value.toLocaleDateString("en-US");
            // console.log(control);
            return null;
        } else {
            return { 'invalidDate': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static numericMaxLengthValidator(control, maxLength) {
        // let numericPattern = /^[0-9]+$/;        
        const numericPattern = /^(([0]?[1-9])|([1-2][0-9])|(3[01]))$/;
        if (control.value.match(numericPattern)
            && control.value.length >= 1
            && control.value.length <= maxLength) {
            return true;
        } else {
            return false;
        }
    }
  
    // tslint:disable-next-line:member-ordering
    static monthValidator(control) {
        if (ValidationService.numericMaxLengthValidator(control, 2) && control.value <= 12){
            return null;
        } else {
            return { 'invalidMonth': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static yearValidator(control) {
        const currentYear = (new Date()).getFullYear();

        const numericPattern = /^((19[3-9]\d)|(20[0-4]\d))+$/;
        if (control.value.match(numericPattern)
            &&  control.value.length === 4 &&  control.value <= currentYear) {
            return null;
        } else {
            return { 'invalidYear': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static numericValidator(control) {
        const numericPattern = /^[0-9]+$/;
        // const numericPattern = /^\d{4}-\d{3}-\d{4}+$/;

        if (control.value.match(numericPattern)) {
            return null;
        } else {
            return { 'invalidNumeric': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static phoneSimpleValidator(control) {
        const numericPattern = /^[0-9]+$/;

        if (control.value.match(numericPattern)) {
            return null;
        } else {
            return { 'invalidPhone': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static passwordValidator(control) {
        // (?=.*\d)          - must contains one digit from 0-9
        // (?=.*[a-zA-Z])    - must contains one characters
        // (?!.*\s)          - no
        // (?!.*[@#$%])      - no special char
        // let passwordPattern = /^(?=.*\d)(?=.*[a-zA-Z])(?!.*[\s@/'\;#$%,ÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝáàâäãåçéèêëíìîïñóòôöõúùûüýÿ^]).{4,12}$/;
        const passwordPattern = /^([ A-Za-z0-9]).{1,12}$/;
        if (control.value.match(passwordPattern)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static AccentValidator(control) {
        const acceentPattern = /[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+/gi;
        if (control.value.match(acceentPattern)) {
            // return null;
            return { 'invalidAccent': true };
        } else {
            return null;
        }
    }

    static dayValidator(){
        return null;
    }

    // tslint:disable-next-line:member-ordering
    static specialCharValidator(control) {
        const acceentPattern = /[$&+,:;=?@#|_'"<>.^*()%!-]+/gi;
        if (control.value.match(acceentPattern)) {
            // return null;
            return { 'invalidspecialChar': true };
        } else {
            return null;
        }
    }

    static pseudoSpecialCharValidator(control) {
        const acceentPattern = /[$&+,:;=?@#|'"<>^*()%!]+/gi;
        if (control.value.match(acceentPattern)) {
            // return null;
            return { 'invalidspecialChar': true };
        } else {
            return null;
        }
    }

    static MajorityValidator(control) {
        const year = control && +control.value;
        const currentYear = +(new Date().getFullYear());
        if (year < currentYear && year && currentYear - year < 18) {
            return { 'isMineur': true };
        } else {
            return null;
        }
    }

    static DayConjointValidator(AC: AbstractControl){
        const day = AC.get('birthCoDay') && +AC.get('birthCoDay').value;
        const month = AC.get('birthCoMonth') && +AC.get('birthCoMonth').value;
        if(month && day && day === 31 && ![1,3,5,7,8,10,12].find(d=>{return d===month}) ){ 
            AC.get('birthCoDay').setErrors({ 'dateconjointerror': true });        
            return { 'dateconjointerror': true };
        }  
        if (AC.get('birthCoDay') && ValidationService.numericMaxLengthValidator(AC.get('birthCoDay'), 3) && AC.get('birthCoDay').value <= 31){            
            AC.get('birthCoDay').setErrors(null);                    
            return null;
        } else {     
            AC.get('birthCoDay').setErrors({ 'dateconjointerror': true });                        
            return { 'dateconjointerror': true };
        }
    }

    static DayValidator(AC: AbstractControl) {
        const day = AC.get('birthDay') && +AC.get('birthDay').value;
        const month = AC.get('birthMonth') && +AC.get('birthMonth').value;      
        if(month && day && day === 31 && ![1,3,5,7,8,10,12].find(d=>{return d===month}) ){  
            AC.get('birthDay').setErrors({ 'dateerror': true });        
            return { 'dateerror': true };
        }  
        if (AC.get('birthDay') && ValidationService.numericMaxLengthValidator(AC.get('birthDay'), 3) && AC.get('birthDay').value <= 31){            
            AC.get('birthDay').setErrors(null);                    
            return null;
        } else {     
            AC.get('birthDay').setErrors({ 'dateerror': true });                        
            return { 'dateerror': true };
        }
    }

    // tslint:disable-next-line:member-ordering
    static MatchPassword(AC: AbstractControl) {        
        const passwordControl = AC.get('password');
        let confirmControl = AC.get('confirmpassword');
        if (confirmControl === null){
            confirmControl = AC.get('confirmPassword');
        }
        if (passwordControl && confirmControl)
        {
            const password = passwordControl.value; // to get value in input tag
            const confirmPassword = confirmControl.value; // to get value in input tag
            if (confirmPassword && password !== confirmPassword) {
                // console.log('false');
                confirmControl.setErrors( {'noMatchPassword': true} );
                return { 'noMatchPassword': true };
            } else {
                confirmControl.setErrors(null);
                return null;
            }
        }
        return null;
    }


    static verifyDate(day, month){      
        return (month && day && month % 2 === 0 && day === 31);
    }

    // tslint:disable-next-line:member-ordering
    static pseudoValidator(control) {
        const pseudoPattern = /^[a-zA-Z]+[a-zA-Z0-9]+.{0,10}$/;
        // pour tester le regex
        // http://www.gethifi.com/tools/regex
        // let pseudoPattern = /^[a-zA-Z]+(?=.*\d)(?=.*[a-zA-Z]).{3,12}$/;
        if (control.value.match(pseudoPattern)) {
            return null;
        } else {
            return { 'invalidPseudo': true };
        }
    }

    static DeuxPremierAlphabet(control){
        const pseudoPattern = /^[a-zA-Z]+[a-zA-Z0-9]+.{0,10}$/;
        if (control.value.match(pseudoPattern)) {
            return null;
        } else {
            return { 'premierAlphabetInvalid': true };
        }
    }

    static lengthValidator(control){
        if (control.value.length <= 12 && control.value.length >= 2) {
            return null;
        } else {
            return { 'invalidLength': true };
        }
    }

    // firstMustLetter
    // tslint:disable-next-line:member-ordering
    static firstMustBeLetterValidator(control) {
        const testPattern = /^[a-zA-Z].*/;
        if (control.value.match(testPattern)) {
            return null;
        } else {
            return { 'firstMustBeLetter': true };
        }
    }




}
