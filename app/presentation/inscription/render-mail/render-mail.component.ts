import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';

import { 
  InscriptionApplicatifServiceACI
 } from '../../../service/applicatif/inscription';

 import { ValidationService } from '../../../contrainte/rule/validation.service';

@Component({
  selector: 'app-render-mail',
  templateUrl: './render-mail.component.html',
  styleUrls: ['./render-mail.component.css']
})
export class RenderMailComponent implements OnInit {
  
  public informationMessage : string = "";
  confirmationParams : any;
  
  slug : String;
  email : String;
  pseudo : String;
  dateSendMail:String;
  isSubmited : Boolean = false;

  renderMailForm: any;
  public controlName: object = null;

  constructor(
    private sharedDataService : SharedDataService,
    private inscriptionApplicatifServiceACI : InscriptionApplicatifServiceACI,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
      this.initializeControleName();
      this.renderMailForm = this.formBuilder.group({
          'code': ['', Validators.required]
        }
      );
   }

  ngOnInit() {
    //console.log("ngOnInit");
    //this.getRouteSnapshotParams();
    this.getRouteParams();
  }

  postConfirmInscription(){
    this.inscriptionApplicatifServiceACI.
            postConfirmInscription(this.pseudo,this.email,this.slug,this.dateSendMail)
            .subscribe(confirmation => {
              this.isSubmited = true;
              let hasError = false;
              let informationMessage = "Votre inscription est confirmée";
              if(confirmation.status !==200){
                informationMessage="Ce lien d'activation n'existe pas";
                hasError = true;
              }
              let result = {
                "hasError" : hasError,
                "message" : informationMessage
              };
              this.sharedDataService.setInscriptionConfirm(result);
              this.router.navigate(['/splashcreen']);
              
            },
            err => {
                let result = {
                "hasError" : true,
                "message" : "Ce lien d'activation n'existe pas"
              };
              this.sharedDataService.setInscriptionConfirm(result);
              this.router.navigate(['/splashcreen']);
            });
  }

  getRouteParams(){
    this.route.params.forEach((params: Params) => {
      this.slug = params["slug"];
      this.dateSendMail = params["dateSendMail"],//.replace("+", " ");          
      this.email = params["mail"];
      this.pseudo = params["pseudo"];
      if(params["dateSendMail"])
      {
        let dateToformat = params["dateSendMail"].split('_');
        //console.log(dateToformat.length);
        this.dateSendMail = dateToformat[0] + "-" + dateToformat[1] + "-" + dateToformat[2] + 
          " " + dateToformat[3] + ":" + dateToformat[4] + ":00" ;
      }
      
      if(params && params.pseudo){
        this.postConfirmInscription();  
      }
      else {
      let result = {
                "hasError" : true,
                "message" : "ce lien d'activation de compte n'est pas valide"
          };
      this.sharedDataService.setInscriptionConfirm(result);
      this.router.navigate(['/splashcreen']);
    } 
    });
  }
  
  initializeControleName(){
    let controlNameConfig : object = {
      "code":"code"
    }
    this.controlName = controlNameConfig;
  }

 
}
