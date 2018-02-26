import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-switch-checkbox',
  templateUrl: './switch-checkbox.component.html',
  styleUrls: ['./switch-checkbox.component.css']
})
export class SwitchCheckboxComponent implements OnInit {
   renderValue: boolean;

  @Input() value: any;
  @Input() rowData: any;
  

  constructor() { }

  ngOnInit() {
    //this.renderValue = this.value && this.value === "true"? true:false;
    //console.log(this.rowData);
    this.renderValue = this.value!==undefined && this.value !==null? this.value.columnValue : false;
  }

  updateCheckedOptions(event: any){
    //console.log("column checked : ",this.rowData[this.value.columnName]);
    this.rowData[this.value.columnName] = event.target.checked;
    /*
     switch (this.value.columnName) {
          case 'visiteur':
            this.rowData.visiteur = event.target.checked;
            break;
          case 'abonne':
            this.rowData.abonne = event.target.checked;
            break;
          case 'moderateur':
            this.rowData.moderateur = event.target.checked;
            break;
          case 'administrateur':
            this.rowData.administrateur = event.target.checked;
            break;

          case 'visiteurHomme':
            this.rowData.visiteurHomme = event.target.checked;
            break;
          case 'visiteurFemme':
            this.rowData.visiteurFemme = event.target.checked;
            break;
          case 'abonneV1':
            this.rowData.abonneV1 = event.target.checked;
            break;
          case 'moderateurV1':
            this.rowData.moderateurV1 = event.target.checked;
            break;
          case 'administrateurV1':
            this.rowData.administrateurV1 = event.target.checked;
            break;
     }
    console.log("column checked : ",this.rowData);
    */
    
}

}
