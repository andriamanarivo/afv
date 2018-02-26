import {Injectable} from '@angular/core';

@Injectable()
export class ConstantService {

public THEME_CLASS: String;

constructor() {
    this.THEME_CLASS = 'theme-default';
  }
}
