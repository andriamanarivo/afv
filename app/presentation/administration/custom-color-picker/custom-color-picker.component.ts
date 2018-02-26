import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-color-picker',
  templateUrl: './custom-color-picker.component.html',
  styleUrls: ['./custom-color-picker.component.css']
})
export class CustomColorPickerComponent implements OnInit {
  // renderValue: boolean;
  selectedColor : string;

  @Input() value: any;
  @Input() rowData: any;
  constructor() { }

  ngOnInit() {
    let selectedColor = '#000';
    if ( this.value !== undefined && this.value !== null && (this.value.columnValue.length === 7 || this.value.columnValue.length === 4)) {
      selectedColor = this.value.columnValue;
    }
    this.selectedColor = selectedColor;
  }

  onColorPickerChange(value: string): void {
    // this.value.columnName
    console.log('columnName' , this.value);
    // this.selectedColor = value;
    this.rowData.valueColor = value;
  }

}
