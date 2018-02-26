import { Injectable } from '@angular/core';

@Injectable()
export class StorageManagementSupport {
  constructor() { }
  public isSupported() {
    if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('testLocalStorage', '1');
            localStorage.removeItem('testLocalStorage');
            return true;
        } catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
            alert(`Your web browser does not support storing settings locally. 
            mitady fika hafa`);
            return false;
        }
    }
  }
}
