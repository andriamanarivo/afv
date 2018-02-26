import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoColumn'
})
export class TwoColumnPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    /*
    let firstColumn : any;
    let secondColumn : any;

    
    for (var i=0; i<value.length; i++) {
      if(i%2==0){
        firstColumn[i] = value[i];
      }      
      else{
        secondColumn[i] = value[i];
      }//newArr.push(arr.slice(i, i+size));
    }
      return [firstColumn, secondColumn];
      */
    //return value.filter((v,i) => i%2==0).map((v,i) => [value[i*2], value[i*2+1]])
    let res = value.filter((v,i) => i%2==0).map((v,i) => [value[i*2], value[i*2+1]]);
    //console.log(res);
    return res;
  }

  

}
