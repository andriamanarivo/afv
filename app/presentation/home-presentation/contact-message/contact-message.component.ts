import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-contact-message',
  templateUrl: './contact-message.component.html',
  styleUrls: ['./contact-message.component.css']
})
export class ContactMessageComponent implements OnInit {

  userDetailId: string

  
  
  constructor(

    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userDetailId =  this.activatedRoute.snapshot.params["id"]

    
  }


}
