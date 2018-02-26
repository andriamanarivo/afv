import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-mention-legale',
    templateUrl: './mention-legale.component.html',
    styleUrls: ['./mention-legale.component.css', '../splashcreen.component.css']
})
export class MentionLegaleComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    goToSplashscreen(): void {
        this.router.navigate(['/splashcreen']);
    }

}
