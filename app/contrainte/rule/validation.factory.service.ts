export class ValidationFactoryService {
    constructor() {       
            
    }

    static isdateValid(birthDay: string, birthMonth: string, birthYear: string) {
        let isDateValide = true;
        let leapYear = this.isLeapYear(+birthYear);
        let maxday = leapYear? 29 : 28;
        let currentMonth : number = +birthMonth;
        let currentDay : number = +birthDay;
        switch (currentMonth) {
        case 2:
            isDateValide = currentDay <= maxday? true : false;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            isDateValide =  currentDay<= 30 ? true : false;
            break;
        default : 
        isDateValide = currentDay<= 31 ? true : false;
        break;
        }
        return isDateValide;
    }

    static isLeapYear(year: number): boolean {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
}