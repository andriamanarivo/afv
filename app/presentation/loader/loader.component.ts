
import { Component, OnInit, Input,   ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input()
  load : boolean;
  constructor() { }

  ngOnInit() {
  }

}
