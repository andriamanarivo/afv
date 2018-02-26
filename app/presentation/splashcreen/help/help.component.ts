import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationApplicatifService } from '../../../service/applicatif/authentication';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css', '../splashcreen.component.css']
})
export class HelpComponent implements OnInit {
  fromSetting;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authApplicatifService: AuthenticationApplicatifService
  ) { 
    this.route.params.subscribe(params => {        
        this.fromSetting = params["fromSetting"];
    });
  }

  ngOnInit() {
  }
  goToSplashscreen(): void {
    const isLogged = this.authApplicatifService.islogged();
    if (+this.fromSetting === 1) {
        this.router.navigate(['/home/modifProfil/1']);
        return;
    }
    if (isLogged) {
        this.router.navigate(['/home/user']);
    } else {
        this.router.navigate(['/splashcreen']);
    }
  }
}
