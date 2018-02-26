import {
   Component, 
   // OnInit ,
   Input
  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { ValidationService } from '../../../contrainte/rule/validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.css']
})
export class ControlMessagesComponent {
  
//implements OnInit {
  @Input() control: FormControl;
  
  @Input() controlName: string;

  invalidEmailAddress: String;
  invalidPassword: String;
  required: String;
  invalidPseudo: String;
  noMatchPassword: String;
  invalidAccent: String;
  invalidspecialChar: String;
  pseudoNotAutorized: string;
  mailNotAutorized: string;
  invalidNumeric: string;
  premierAlphabetInvalid: string;

  minorNotAutorized: string;

  invalidPhone: string;
  invalidCodePays: string;
  firstMustBeLetterValidator: string;

  invalidDay: string;
  invalidMonth: string;
  invalidYear: string;

  minorMessage: string;
  invalidLength: string;

  constructor(private translate: TranslateService) {

    this.translate.get('invalidDay').subscribe((res: string) => {
      this.invalidDay = res;
    });
    this.translate.get('invalidMonth').subscribe((res: string) => {
      this.invalidMonth = res;
    });
    this.translate.get('invalidYear').subscribe((res: string) => {
      this.invalidYear = res;
    });

    this.translate.get('invalidEmailAddress').subscribe((res: string) => {
      this.invalidEmailAddress = res;
    });
    this.translate.get('invalidCodePays').subscribe((res: string) => {
      this.invalidCodePays = res;
    });
    this.translate.get('invalidPassword').subscribe((res: string) => {
      this.invalidPassword = res;
    });
    this.translate.get('Required').subscribe((res: string) => {
      this.required = res;
    });
    this.translate.get('noMatchPassword').subscribe((res: string) => {
      this.noMatchPassword = res;
    });
    this.translate.get('invalidAccent').subscribe((res: string) => {
      this.invalidAccent = res;
    });
    this.translate.get('invalidspecialChar').subscribe((res: string) => {
      this.invalidspecialChar = res;
    });
    this.translate.get('invalidPseudo').subscribe((res: string) => {
      this.invalidPseudo = res;
    });
    this.translate.get('firstMustBeLetter').subscribe((res: string) => {
      this.firstMustBeLetterValidator = res;
    });
    this.translate.get('pseudoNotAutorized').subscribe((res: string) => {
      this.pseudoNotAutorized = res;
    });
      this.translate.get('mailNotAutorized').subscribe((res: string) => {
          this.mailNotAutorized = res;
      });

    this.translate.get('minorNotAutorized').subscribe((res: string) => {
      this.minorNotAutorized = res;
    });

    this.translate.get('minorMessage').subscribe((res: string) => {
      this.minorMessage = res;
    });

    this.translate.get('invalidNumeric').subscribe((res: string) => {
      this.invalidNumeric = res;
    });

    this.translate.get('invalidPhone').subscribe((res: string) => {
      this.invalidPhone = res;
    });

    this.translate.get('invalidLength').subscribe((res: string) => {
      this.invalidLength = res;
    });

    this.translate.get('premierAlphabetInvalid').subscribe((res: string) => {
      this.premierAlphabetInvalid = res;
    });

   }
  
  get errorMessage() {
    // console.log(this.controlName);
    // console.log(this.control);
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        let errormessage =  ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        // console.log(errormessage);
        switch (errormessage) {
            case 'invalidEmailAddress':
                errormessage =  this.invalidEmailAddress;
                break;
                case 'invalidDay':
                errormessage =  this.invalidDay;
                break;
                case 'invalidMonth':
                errormessage =  this.invalidMonth;
                break;
                case 'invalidYear':
                errormessage =  this.invalidYear;
                break;
            case 'invalidCodePays':
                errormessage = this.invalidCodePays;
                break;
            case 'invalidPassword':
                errormessage = this.invalidPassword;
                break;
            case 'pseudoNotAutorized':
                errormessage = this.pseudoNotAutorized;
                break;
            case 'mailNotAutorized':
                errormessage = this.mailNotAutorized;
                break;
                case 'invalidNumeric':
                errormessage = this.invalidNumeric;
                break;
                case 'invalidPhone':
                errormessage = this.invalidPhone;
                break;
            case 'minorNotAutorized':
                errormessage = this.minorNotAutorized;
                break;
            case 'invalidPseudo':
                errormessage = this.invalidPseudo;
                break;
            case 'invalidAccent':
                errormessage = this.invalidAccent;
                break;
            case 'invalidspecialChar':
                errormessage = this.invalidspecialChar;
                break;
                //
            case 'noMatchPassword':
                errormessage = this.noMatchPassword;
                break;
            case 'firstMustBeLetter' :
                errormessage = this.firstMustBeLetterValidator;
                break;
            case 'minorMessage' :
                errormessage = this.minorMessage;
                break;
            case 'invalidLength' :
                errormessage = this.invalidLength;
                break;
             case 'premierAlphabetInvalid':
                errormessage = this.premierAlphabetInvalid;
                break;
            case 'Required':
                let controlName = this.controlName;
                switch (controlName) {
                  case 'datenaissance':
                      controlName = 'date de naissance';
                      break;
                  case 'datenaissanceconjoint':
                      controlName = 'date de naissance conjoint';
                  break;
                }
                errormessage =  this.required.replace('{fieldName}', controlName);
                break;
                case 'invalidDate':
                errormessage =  'invalidDate';
                break;
            default:
              errormessage = errormessage;
             break;
        }        
        return errormessage;
      }
    }
    
    return null;
  }
  
}
