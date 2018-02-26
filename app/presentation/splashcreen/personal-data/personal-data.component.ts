import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-personal-data',
    templateUrl: './personal-data.component.html',
    styleUrls: ['./personal-data.component.css', '../mention-legale/mention-legale.component.css', '../splashcreen.component.css']
})
export class PersonalDataComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    goToSplashscreen(): void {
        this.router.navigate(['/splashcreen']);
    }

}
