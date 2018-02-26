import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationApplicatifService } from '../../../service/applicatif/authentication';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', '../splashcreen.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private router: Router,
    private authApplicatifService: AuthenticationApplicatifService
  ) { }

  ngOnInit() {
  }
  goToSplashscreen(): void {
    const isLogged = this.authApplicatifService.islogged();
    if (isLogged) {
        this.router.navigate(['/home/user']);
    } else {
        this.router.navigate(['/splashcreen']);
    }
  }

}
