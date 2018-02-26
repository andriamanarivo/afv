import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderByTimesStamp', pure: false})
export class OrderByTimeStamp implements PipeTransform {
    transform(input:any, args: string): any{    
        if(!Array.isArray(input) || (Array.isArray(input) && input.length <= 1)) return input;
        if (input == null) {
            return null;
        }
        let order = args.substr(0, 1) === '-' ? -1 : 1;
        if(!args || args === '-' || args ==='+'){
            return order === 1 ? input.sort() : input.sort().reverse();
        }
        else {
            let property:string = args.substr(0, 1) == '+' || args.substr(0, 1) == '-'
            ? args.substr(1) : args;
            input.sort((a: any, b: any) => {
                let left = (a[property]!==undefined && a[property] !==null)?Number(new Date(a[property]).getTime()):0;
                let right =(b[property]!==undefined && b[property] !==null)?Number(new Date(b[property]).getTime()):0;
                return  right - left;
                /* if (a[property] < b[property] ){
                    return -1 * order;
                }else if( a[property] > b[property] ){
                    return 1 * order;
                }else{
                    return 0;
                } */
            });
            return input;
        }
        
    }
}
