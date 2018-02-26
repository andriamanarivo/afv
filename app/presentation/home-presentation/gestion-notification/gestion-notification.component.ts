import { Component, OnInit } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { HomeApplicatifServiceACI } from "../../../service/applicatif/home/home.applicatif.service.aci";
import {NotificationDto} from "../../../donnee/home/notification-dto";

@Component({
  selector: 'app-gestion-notification',
  templateUrl: './gestion-notification.component.html',
  styleUrls: ['./gestion-notification.component.css']
})


export class GestionNotificationComponent implements OnInit {
  gestions: NotificationDto[];
  constructor(private homeService:HomeApplicatifServiceACI) { 

  }

  ngOnInit() {
    this.homeService.getListGestionNotification().subscribe(list=>{
        for(var i in list){
          if(list[i].isChecked){
            list[i].isChecked=false;
          }else{
            list[i].isChecked=true;
          }
        }
        this.gestions=list;
    });
  }

  changeActive(gestion){
      this.homeService.editStatutNotification(gestion).subscribe(list=>{
        console.log(list);
    });
  }
}
