import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
  /* pour resoudre le conflit de bootstrap */
  encapsulation: ViewEncapsulation.None,
  /* styleUrls: ['../../../admin-styles.scss'] */
  
})
export class AdministrationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
