import { Component, OnInit } from '@angular/core';
import { AdministrationApplicatifServiceACI } from 'app/service/applicatif/administration';
import { Http } from '@angular/http';

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
   
    query: any;
    first: any;
    max: any;
    afile: Array<any>[] = [];
    userNotFound: Array<any>[] = [];
    already: Array<any>[] = [];
    filesToMigrate: Array<any>[] = [];
    sqlData: any = {already:[], afile:[]};
    importFailed:boolean=false;
    nbTotal:number = 0;
    firstCall = true;
    updateQuery: Array<any>[] = [];
    activeImport = false;
    urlWs = '';

    constructor(
        private adminService: AdministrationApplicatifServiceACI,
        private http: Http
    ) { }

    ngOnInit() {
        // this.getUserNotFound();       
        this.getNbFileMigration({values:this.userNotFound});
    }

    getUserNotFound(){
        this.adminService.getUserNotFound()
            .subscribe(res=>{
                if(res.values){
                    this.userNotFound = res.values;
                }
                this.getNbFileMigration({values:this.userNotFound});
            }, err=>{
                console.log(err);
            });
    }

    getNbFileMigration(data){
        this.adminService.getNbFileMigration(data)
            .subscribe(res=>{
                console.log(res);
                if(res.nbTotal){
                    this.nbTotal= res.nbTotal;
                    this.activeImport = true;
                }                
            },err=>{
                console.log(err);
            });
    }

    sendGetRequest(): void{
        this.http.get(this.urlWs) 
            .map(res=>res.json())
            .catch(err=>err.json())
            .subscribe(res=>{
                console.log(res);
            },err=>{
                console.log(err);
            });
    }

    addToAlready(): void{
        this.adminService.getSqlData(this.sqlData)
            .subscribe(res=>{
                console.log(res);
                this.firstCall = false;
            }, err=>{
                console.log(err);
            });
    }

    updateAfterAdd(): void {
        console.log(this.updateQuery);
        console.log("nb process update: ", this.updateQuery.length);
        if (this.updateQuery) {
            this.updateQuery.forEach(query => {
                this.adminService.executeImport({ sql: query['update'] })
                    .subscribe(resUpdate => {
                        
                    }, err => {
                        console.log("updateAfterAdd error : ", err);
                    })
            })
        }
    }
   
    update(): void{
        this.addToAlready();      
        console.log(this.nbTotal);
        let offset = 150;
        let nb = Math.round(this.nbTotal / offset);
        console.log(nb);      
        for (var i = 0; i < nb; i++) {
            let first = (i * offset) + 1;
           
            this.adminService.getNameFileMigration({ max: offset, first: first, values: this.userNotFound })
                .subscribe(fileMigration => {
                    // console.log(fileMigration);
                    if (fileMigration.values) {
                        //this.sqlData.already = [];
                        this.sqlData.afile = fileMigration.values;

                        this.adminService.getSqlData(this.sqlData)
                            .subscribe(query => {
                                // console.log(query);
                                
                                this.adminService.executeImport({ sql: query.update })
                                    .subscribe(resUpdate => {
                                        // console.log(resUpdate);  
                                        this.importFailed = resUpdate.toLowerCase() === 'failed'.toLowerCase();
                                        if (!this.importFailed) {
                                            this.sqlData.already = [...this.sqlData.already, ...fileMigration.values];
                                            this.sqlData.afile = [];
                                        }
                                    }, err => {
                                        console.log("=========UPDATE==========");
                                        console.log(this.sqlData.afile);
                                        console.log(err);
                                    });
                            }, err => {
                                console.log(err);
                            });
                    }
                }, err => {
                    console.log(err);
                });

        }
    }

    add(): void {       
        this.addToAlready();      
        console.log(this.nbTotal);
        let offset = 150;
        let nb = Math.round(this.nbTotal / offset);
        console.log("nb process add: ", nb);      
        for (var i = 0; i < nb; i++) {
            let first = (i * offset) + 1;
           
            this.adminService.getNameFileMigration({ max: offset, first: first, values: this.userNotFound })
                .subscribe(fileMigration => {
                    // console.log(fileMigration);
                    if (fileMigration.values) {
                        //this.sqlData.already = [];
                        this.sqlData.afile = fileMigration.values;
                        this.filesToMigrate

                        this.adminService.getSqlData(this.sqlData)
                            .subscribe(query => {
                                // console.log(query);
                                this.updateQuery.push(query.update);
                                this.adminService.executeImport({ sql: query.insert })
                                    .subscribe(resInsert => {
                                        this.sqlData.afile = [];                                       
                                    }, err => {
                                        console.log("=========INSERT==========");
                                        console.log(this.sqlData.afile);
                                        console.log(err);
                                    });
                            }, err => {
                                console.log(err);
                            });
                    }
                }, err => {
                    console.log(err);
                });

        }
    }

    exectuteImport(data): void {
        this.adminService.executeImport(data)
            .subscribe(res => {
                console.log(res);
            }, err => {
                console.log(err);
            });
    }

    getSqlData(): void{
        let data = {already: this.already, afile: this.afile};
        this.adminService.executeImport(data)
            .subscribe(res=>{
                console.log(res);
            }, err=>{
                console.log(err);
            });
    }

    executeImport(): void {
        let data = {sql: this.query};
        this.adminService.executeImport(data)
            .subscribe(res=>{
                console.log(res);
            }, err=>{
                console.log(err);
            });
    }

}
