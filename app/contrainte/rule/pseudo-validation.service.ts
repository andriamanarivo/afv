import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from 'ng2-translate';




import { PseudoApplicatifServiceACI
 } from '../../service/applicatif/pseudo';


@Injectable()
export class PseudoValidationService {
  // public pseudos: any[];
  public pseudos: any[];
  constructor( private pseudoApplicatifService: PseudoApplicatifServiceACI) {
    this.pseudoApplicatifService.getPseudo().subscribe(res => {
      // console.log('pseudos ', res);
      this.pseudos = res;
    });
  }

  public pseudoAutorizedValidator(name: string, pseudos: any[]) {
    // console.log(name);
    // console.log(pseudos);
    // let invalidPseudo = false;
    const invalidPseudo = pseudos.some(it => name.trim().toLocaleLowerCase().indexOf(it.name.trim().toLocaleLowerCase()) !== -1);
    // console.log(invalidPseudo);
    return !invalidPseudo;

    // return !invalidPseudo? null: { 'PseudoNotAutorized': true }
  }

  public pseudoIsAutorizedValidator(name: string) {
    // console.log(name);
    // console.log(pseudos);
    // let invalidPseudo = false;
    const invalidPseudo = this.pseudos.some(it => name.trim().toLocaleLowerCase().indexOf(it.name.trim().toLocaleLowerCase()) !== -1);
    // console.log(invalidPseudo);
    return !invalidPseudo;

    // return !invalidPseudo? null: { 'PseudoNotAutorized': true }
  }


}
