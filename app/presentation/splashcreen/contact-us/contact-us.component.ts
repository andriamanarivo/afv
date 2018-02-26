import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { AppConfig } from 'app/contrainte/config/_app/app.config';
import { Message } from 'app/donnee/splashScreen/message';
import { SplashscreenApplicatifServiceACI } from 'app/service/applicatif/splashscreen/splashscreen.applicatif.service.aci';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'app/contrainte/rule/validation.service';


@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css', 
    '../../inscription/inscription-confirm-presentation/inscription-confirm-presentation.component.css'],
    providers:[MessageService]
})
export class ContactUsComponent implements OnInit {
    successMessage: string;
    emailDataForm: FormGroup;
    errorMessage: string = '';
    idSite: string = '';
    loading: boolean = false;
    msgs: MessagePrimeNg[] = [];
    constructor(
        private formBuilder: FormBuilder,
        private router: Router, 
        private appConfig: AppConfig,
        private splashscrennService: SplashscreenApplicatifServiceACI,
        private messageService: MessageService,
    ) {
        
        this.createForm();
        // this.emailDataForm.controls['email'].valueChanges.subscribe(c=>{
        //     console.log(c);
        // });
    }
    
    uncapitalizeEmail(){
        this.emailDataForm.controls['email'].setValue(this.emailDataForm.controls['email'].value.toLowerCase());
    }
    ngOnInit(): void {
        this.idSite = this.appConfig.getSiteIdByLocation();
    }

    goToSplashscreen(): void {
        this.router.navigate(['/home/modifProfil/1']);
    }

    sendEmail(): void {
        this.markAsTouched();
        if (this.emailDataForm.valid) {
            this.loading = true;
            let data = new Message(
                this.emailDataForm.controls['name'].value,
                this.emailDataForm.controls['email'].value,
                this.emailDataForm.controls['objet'].value,
                this.emailDataForm.controls['text'].value,
                this.idSite
            );
            this.splashscrennService.sendMessage(data)
                .subscribe(res => {   
                    this.createForm();
                    this.loading = false; 
                    if (res.statut === 200) {
                        this.successCallback("Message envoyé");
                        this.successMessage = "Message envoyé"
                    } else if(res.statut === 500){
                        this.showError(res);
                    }
                }, err => {
                    //this.errorCallback(err);
                    this.createForm();
                    this.errorCallback(err);
                    this.loading = false; 
                });
        } else {
            console.log("ERROR");
            this.loading = false; 
            // this.errorCallback("Veuillez vérifier vos données");
        }
    }

    createForm(): void{
        this.emailDataForm = this.formBuilder.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.required, ValidationService.emailValidator]],
            'objet': ['', Validators.required],
            'text': ['', Validators.required],
        });
    }
   
    showError(errorData:any): void{
        switch (errorData.error) {
            case 'sendMailFailed':
            this.errorCallback("Erreur lors de l'envoie de l'email");            
                break;        
            default:
            this.errorCallback(errorData.error);
                break;
        }
    }

    errorCallback(err): void {
        this.loading = false;        
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }

    successCallback(info):void{
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: '', detail: info });
    }

    markAsTouched(): void {
        Object.keys(this.emailDataForm.controls).forEach(key => {
            this.emailDataForm.controls[key].markAsTouched();
        });
    }

    getErrorClass(field: string): any {
        const res = {
            errorinput: this.emailDataForm.controls[field].hasError('required') && this.emailDataForm.controls[field].touched
        };
        if (field === 'email') {
            res.errorinput = res.errorinput = res.errorinput || (this.emailDataForm.controls[field].hasError('email') && this.emailDataForm.controls[field].touched);
        }
        return res;
    }

}
