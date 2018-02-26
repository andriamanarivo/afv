import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import {Message as MessagePrimeNg} from 'primeng/primeng';

import { UtilisateurApplicatifServiceACI } from '../../../service/applicatif/utilisateur';
import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration/administration.applicatif.service.aci';

import { UtilisateurCriteria } from '../../../donnee/utilisateur/utilisateur-criteria';
import { UtilisateurDto } from '../../../donnee/utilisateur';
import { AuthenticationApplicatifServiceACI } from '../../../service/applicatif/authentication';

import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import {StatutModerationDo} from '../../../donnee/statut/statut-moderation-do';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { PhotoPdp } from '../../../commun/photo.pdp';
import { UtilsService } from 'app/commun/utils.service';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

declare const Strophe;
declare const $msg;

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.css']
  // ,providers : [UtilisateurCriteria]
})
export class UtilisateurListComponent implements OnInit {

  isLoading = false;

  isLoadingModal = false;
  currentUser: any;
  isAllowed: boolean;
  isAdmin: boolean=false;
  hasError = false;
  errorMessage = '';
  users: UtilisateurDto[];
  userCriteria: UtilisateurCriteria;
  public rows: Array<any> = [];
  public columns: Array<any> = [];
  // pagination
  public page = 1;
  public currentPage = 0;

  // translation
  ResetPasswordLink: string;
  wrongMailOrPassword: string;
  userNotFoundLdap: string;
  connectionLdapFailed: string;
  passwordInvalid: string;
  codeConfirmationInvalid: string;
  adressEmailInvalid: string;
  dataInvalid: string;
  inputEmpty: string;
  notResult: string;
  resetPasswordFailed: string;
  userNotFound: string;
  mailSucces: string;
  timeOutConfirmation: string;

  baseUrl = '';
  public isSearch = false;
  public itemsPerPage = 20;
  currentItemsPerPage = 20;
  public maxSize = 5;
  public numPages = 1;
  public length = 0;
  public nbUserToModerate = 0;
  public config: any ;
  private data: Array<any>;

  // tri
  private orderColumn: string;
  private orderDirection: string;

 // openFireConnect
  boshService: string;
  userName: string;
  password: string;
  userJid: string;
  private connection;

  alertCssClass: string;
  public informationMessage = '';
  itemSelected: string;
  roles: string[];


  statusModeration: StatutModerationDo[];
  uid: string;
  msgs: MessagePrimeNg[] = [];
  @ViewChild('childModal') public childModal: ModalDirective;
  titleModif= 'Modifier statut moderation';

  @ViewChild('rolesModal') public rolesModal: ModalDirective;
  rolesTitle= 'Modifier rôles';
  public selectedrole: any;
  public selectedroles:  string[] = [];
  public defaultModeration:string;
  constructor(
    // private utilisateurCriteria : UtilisateurCriteria,
    private appConfig: AppConfig,
    private route: ActivatedRoute,
    private router: Router,
    private utilisateurApplicatifService: UtilisateurApplicatifServiceACI,
    private administrationApplicatifServiceACI: AdministrationApplicatifServiceACI,
    private authenticationApplicatifService: AuthenticationApplicatifServiceACI,
    private homeApplicatifServiceACI: HomeApplicatifServiceACI,
    private translate: TranslateService,
    private photoPdp: PhotoPdp,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private jwtHelper: JwtHelper,
    private utilsService: UtilsService
  ) {
        const token = sessionStorage.getItem('id_token');
        this.currentUser = this.jwtHelper.decodeToken(token);
        if (this.currentUser.roles.indexOf('ADMINISTRATEUR') !== -1)  {
            this.isAdmin = true;
        }
        this.initializeColumns();
        this.initializeConfig();
        this.length = 0;
  }

  ngOnInit() {
    this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
    this.baseUrl = this.baseUrl.replace('/app_dev.php', '');
    this.utilisateurApplicatifService.getStatutModeration().subscribe(STATUT => {
        this.defaultModeration=STATUT[0].id;
        this.itemSelected=STATUT[0].id;
        this.userCriteria.moderation=STATUT[0].id;
        this.statusModeration = STATUT.map(m => {
             m.libelle = this.utilsService.capitalizeFirstLetter(m.libelle);
             return m;
        });
    });
    this.route.params.forEach((params: Params) => {
        if (params['etat']) {
            this.alertCssClass = 'success';
            this.informationMessage =  params['etat'];
        }
    });
    this.itemsPerPage = this.appConfig.getConfig('adminItemsPerPage');
    if (this.userCriteria === undefined){
      this.userCriteria = new UtilisateurCriteria('aucun', '', '', this.page, this.itemsPerPage, '', '',this.defaultModeration);
    }
    this.isLoading = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.onChangeTable(this.config);
    }, 5000);
  }

  onUserTypeChange(event, userTypeValue) {
    if (this.userCriteria) {
      this.userCriteria.isActive = userTypeValue;
    }
  }
  recherchekeyup(recherche) {
    if (this.userCriteria && recherche) {
      this.userCriteria.search = recherche;
    }
  }
  changeItemsPerPage(itemsPerPage) {
    this.itemsPerPage = itemsPerPage;
    if (this.userCriteria){
        this.userCriteria.pageCount = itemsPerPage;
      }
    // this.appConfig.setConfig("adminItemsPerPage") = itemsPerPage;
    this.onChangeTable(this.config);
  }

  listUsers(listAll: boolean, userForm) {
    this.isSearch = true;
    if (listAll) {
      if (this.userCriteria){
        this.userCriteria.isActive = 'aucun';
        this.userCriteria.search = '';
        this.page = 1;
        userForm.reset();
      }
    }
    this.onChangeTable(this.config);
  }

    initializeConfig() {
        this.config = {
            paging: true,
            sorting: { columns: this.columns },
            filtering: { filterString: '' },
            className: ['table-striped', 'table-bordered']
        };
    }

    initializeColumns() {
        this.columns = [];
        this.columns .push({title: ' Photo de profil', name: 'PhotoProfil', sort: false});
        this.columns .push({title: 'Pseudo', className: ['sortableColumn'], name: 'pseudo'});
        // this.columns .push({title: 'Description', name: 'description' , sort: false});
        // this.columns .push({title: 'Date de naissance', name: 'dateNaissance', sort: false});
        this.columns .push({title: 'Date de création', className: ['sortableColumn'], name: 'dateCreation'});
        this.columns .push({title: 'Ville', name: 'villeFullName', sort:false});
        this.columns .push({title: 'Genre', name: 'vetes', sort: false});
        this.columns .push({title: 'Statut', name: 'statutCompte', sort: false});
        this.columns .push({title: 'Modération', name: 'moderation', sort:false});
        if (this.isAdmin) {
            this.columns .push({title: 'rôles', name: 'roles', sort: false});
        }
        this.columns .push({title: 'Email', className: ['sortableColumn'],  name: 'email'});
        this.columns .push({title: 'IP',  className: ['sortableColumn'],  name: 'ip'});
        this.columns .push({title: 'Site', className: ['sortableColumn'],  name: 'site'});
        this.columns .push({title: 'Action', name: 'btnActive', sort: false});
        this.columns .push({title: 'Réinitialiser le mot de passe', name: 'initMdp', sort: false});
        // this.columns .push({title: 'Rejeter Mail', name: 'rejetMail', sort: false});
        this.columns .push({title: 'Rejeter Pseudo', name: 'rejetPseudo', sort: false});
        if(this.isAdmin){
            this.columns .push({title: '',   name: 'action', sort: false});
        }
      }


//   {title: '',   name:'action1', sort:false}

    public changeSort(config: any) {
        if (config.sorting) {
            const columns = this.config.sorting.columns || [];
            const columnName: string = void 0;
            const sort: string = void 0;

            for (let i = 0; i < columns.length; i++) {
                if (columns[i].sort !== '' && columns[i].sort !== false && columns[i].sort !== undefined) {
                    this.orderColumn = columns[i].name;
                    this.orderDirection = columns[i].sort;
                    if (this.userCriteria) {
                        this.userCriteria.orderColumn = this.orderColumn ? this.orderColumn : '';
                        this.userCriteria.orderDirection = this.orderDirection ? this.orderDirection : '';
                    }
                }
            }
        }
    }


  public changeFilter(config: any) {
    const columnFilter: Array<any> = [];
    this.columns.forEach((column: any) => {
      if (column.filtering && column.filtering.filterString) {
        const itemFilter: any = {};
        itemFilter.keyFilter = column.name;
        itemFilter.valueFilter = column.filtering.filterString;
        columnFilter.push(itemFilter);
      }
    });
    // console.log("columnFilter : ", columnFilter);
  }

  tempConfig: any;
  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
      const d = { config: config, page: page };
      let res;
      if (this.tempConfig) {
        res = this.isSameConfig(this.tempConfig, d);
      }
      if (!res || this.currentItemsPerPage !== this.userCriteria.pageCount || this.isSearch) {
          this.currentPage = page.page;
          this.changeSort(this.config);
          if (this.currentItemsPerPage !== this.userCriteria.pageCount) {
              this.currentItemsPerPage = this.userCriteria.pageCount;
          }
          if (this.userCriteria.isActive) {
              const isActive = this.userCriteria.isActive.split(')');
              if (isActive.length > 0) {
                  this.userCriteria.isActive = isActive[0].replace('(', '');
              }
          }
          this.userCriteria.pageIndex = page.page;
          this.userCriteria.statut = '0';
          if (this.userCriteria.isActive === '3') {
              this.userCriteria.statut = '1';
              this.userCriteria.isActive = '2';
          }
          this.isLoading = true;
          if (this.userCriteria.search !== '') {
            this.userCriteria.pageIndex = 1;
          }
          console.log('filtre',JSON.stringify(this.userCriteria));
          this.utilisateurApplicatifService.getUtilisateurs(this.userCriteria)
              .subscribe(users => {
                  this.tempConfig = {
                      config: JSON.parse(JSON.stringify(config)),
                      page: JSON.parse(JSON.stringify(page))
                  };
                  let usersModified = [];
                  if (users.items) {
                    usersModified = users.items.map(user => {
                        let photoUrl = '' ;
                        if (!user.pdp) {
                            if (user.idVsEtes !== null) {
                                const profilePhoto = this.photoPdp.getPhotoPdp(user.idVsEtes);
                                if (profilePhoto) {
                                    photoUrl = profilePhoto.pdp;
                                } else {
                                    photoUrl = 'assets/img/profil-default.png';
                                }
                            } else {
                                photoUrl = 'assets/img/profil-default.png';
                            }
                        } else {
                            photoUrl = this.baseUrl + user.pdp.replace('file_uploaded/', 'file_uploaded/square_320_');
                            // user.PhotoProfil = photoUrl;
                        }
                        user.PhotoProfil = `<span class="profil-gm"><img  src = "${ photoUrl }"></span>`;
                        if (this.isAdmin) {
                            user.roles = `<a class=\'btnEdits\'><span class=\"editTerme\"  data-id=
                            ${ user.id } ><i class=\"fa fa-pencil-square-o\" ></i> </span>modifier rôle</a>`;
                        }
                        return user;
                    });
                  }
                  this.data = usersModified;
                  this.nbUserToModerate = users.nbAmodere;
                  if (this.data.length > 0){
                    for (let i = 0; i < this.data.length; i++) {
                        this.data[+i]['moderation'] = '<a class=\'btnEdits\'><span class=\"editTerme\"  data-id=' +
                        this.data[+i].id + '><i class=\"fa fa-pencil-square-o\" ></i> </span>' + this.data[+i].statutModeration + '</a>';
                        if (this.isAdmin) {
                            this.data[+i]['action'] = ' <a> <span class=\"deleteEmployee\"  data-id=' + this.data[+i].moduleId +
                            '> <i class=\"fa fa-trash-o\" ></i> </span> </a>';
                        }
                        this.data[+i]['initMdp'] = '<button type="button" data-id="' + this.data[+i].id +
                        '"  class="btn btn-success">Reinitialisez </button>';
                        // this.data[+i]['rejetMail'] = '<button type="button" data-id="' + this.data[+i].id +
                        //  '"  class="btn btn-success">Rejeter Mail</button>';
                        this.data[+i]['rejetPseudo'] = '<button type="button" data-id="' + this.data[+i].id +
                         '"  class="btn btn-success">Rejeter Pseudo</button>';
                        if (this.data[+i].isActive === 1 && this.data[+i].statut === 0) {
                            // comte crée
                            this.data[+i]['btnActive'] = '<button type="button" data-id="' + this.data[+i].id +
                            '"  class="btn btn-success">Activer</button>';
                        } else if (this.data[+i].isActive === 2 && this.data[+i].statut === 0) {
                            // compte validé
                            this.data[+i]['btnActive'] = '<button type="button" data-id="' + this.data[+i].id +
                            '"  class="btn btn-success">Suspendre</button>';
                        } else if (this.data[+i].isActive === 2 && this.data[+i].statut === 1) {
                            // compte suspendu
                            this.data[+i]['btnActive'] = '<button type="button" data-id="' + this.data[+i].id +
                            '"  class="btn btn-success">Reprendre</button>';
                        } else {
                            this.data[+i]['btnActive'] = '';
                        }
                    }
                  }
                  console.log('data',this.data);
                  this.rows = this.data;
                  this.length = users.total;
                  this.isLoading = false;
              },
              err => {
                  this.errorMessage = err.message ? err.message : err;
                  this.isLoading = false;
                  // console.log("error");
              });
          this.isSearch = false;
      }
  }

  getEmptyMessage(): string {
      return this.data && this.data.length > 0 ? '' : 'Aucun résultat pour votre recherche';
  }

  isSameConfig(lastConfig, newConfig) {
    return lastConfig.config.filtering.filterString === newConfig.config.filtering.filterString
    && lastConfig.config.filtering.paging === newConfig.config.filtering.paging &&
    this.isSameSorting(lastConfig.config.sorting.columns, newConfig.config.sorting.columns) &&
    lastConfig.page.page === newConfig.page.page;
 }

  isSameSorting(tab1, tab2) {
    return tab1.length === tab2.length && tab1.every((v, i) =>
    v.sort === tab2[i].sort);
  }



    public onCellClick(data: any): any {
        if (data && data.row && data.row.id && data.column !== 'action' && data.column !== 'btnActive' && data.column !== 'roles'
        && data.column !== 'initMdp' && data.column !== 'rejetPseudo' && data.column !== 'moderation') {
            this.router.navigate(['/administration/utilisateur/' + data.row.id]);
        }

        if (this.isAdmin) {
            if (data.column === 'action') {
                this.openConfirmModal(data.row.id);
            }
        }

        if (data.column === 'roles') {
            this.selectedroles = [];
            this.isLoadingModal = true;
            this.uid = data.row.id;
            this.utilisateurApplicatifService.siteRoles(data.row.idSite)
                .subscribe(siteRoles => {
                    this.roles = siteRoles;
                    this.utilisateurApplicatifService.userRoles(this.uid)
                        .subscribe(userRoles => {
                            if (userRoles && userRoles.result) {
                                userRoles.result.forEach(userRole => {
                                    this.selectRole(userRole);
                                    this.isLoadingModal = false;
                                });
                            }
                        }, err => {
                            this.isLoadingModal = false;
                            this.errorMessage = 'erreur ws';
                        }, err => {
                            this.isLoadingModal = false;                            
                        });
                });
            this.rolesModal.show();
        }
        if (data.column === 'moderation') {
            this.uid = data.row.id;
            this.homeApplicatifServiceACI.getUserDetail(data.row.id).subscribe(userDetail => {
                this.itemSelected = userDetail.uidStatutModeration;
            });
            this.childModal.show();
        }

        if (data.column === 'btnActive') {
            let statut = 1;
            if (data.row.isActive === 2 && data.row.statut === 0) {
                statut = 0;
            }

            if (data.row.isActive === 1 && data.row.statut === 0) {
                this.utilisateurApplicatifService.activeUsers(data.row.id)
                    .subscribe(res => {
                        if (res.status === 200){
                            this.loadUser();
                        } else {
                            this.errorMessage = 'erreur ws';
                        }
                    }, err => {
                        this.errorMessage = err.message ? err.message : err;
                });
            } else {
                this.utilisateurApplicatifService.desactiveUsers(data.row.id, statut)
                    .subscribe(res => {
                        if (res.status === 200) {
                            this.loadUser();
                        } else {
                            this.errorMessage = 'erreur ws';
                        }
                    }, err => {
                        this.errorMessage = err.message ? err.message : err;
                });
            }
        }

        if (data.column === 'initMdp') {
            this.resetPassword(data.row.pseudo, data.row.idSite);
        }

        // if (data.column === 'rejetMail') {
        //     this.userRejectMail(data.row.id);
        // }

        if (data.column === 'rejetPseudo') {
            this.userRejectPseudo(data.row.id);
        }

    }
    public loadUser(){
        this.isLoading = true;
        this.utilisateurApplicatifService.getUtilisateurs(this.userCriteria).subscribe(users => {
            let usersModified = [];
            if (users.items) {
              usersModified = users.items.map(user => {
                  let photoUrl = '' ;
                  if (!user.pdp) {
                      if (user.idVsEtes !== null) {
                          const profilePhoto = this.photoPdp.getPhotoPdp(user.idVsEtes);
                          if (profilePhoto) {
                              photoUrl = profilePhoto.pdp;
                          } else {
                              photoUrl = 'assets/img/profil-default.png';
                          }
                      } else {
                          photoUrl = 'assets/img/profil-default.png';
                      }
                  } else {
                      photoUrl = this.baseUrl + user.pdp.replace('file_uploaded/', 'file_uploaded/square_320_');
                      // user.PhotoProfil = photoUrl;
                  }
                  user.PhotoProfil = `<span class="profil-gm"><img  src = "${ photoUrl }"></span>`;
                  if (this.isAdmin) {
                    user.roles = `<a class=\'btnEdits\'><span class=\"editTerme\"  data-id=
                    ${ user.id } ><i class=\"fa fa-pencil-square-o\" ></i> </span>modifier rôle</a>`;
                  }
                  return user;
              });
            }
            this.data = usersModified;
                if (this.data.length > 0) {
                    for (let i = 0; i < this.data.length; i++) {
                        this.data[+i]['moderation'] = '<a class=\'btnEdits\'><span class=\"editTerme\"  data-id=' +
                        this.data[+i].id + '><i class=\"fa fa-pencil-square-o\" ></i></span>' +
                        this.data[+i].statutModeration + '</a>';
                        if (this.isAdmin) {
                            this.data[+i]['action'] = ' <a> <span class=\"deleteEmployee\"  data-id=' +
                            this.data[+i].moduleId + '> <i class=\"fa fa-trash-o\" ></i> </span> </a>';
                        }
                        this.data[+i]['initMdp'] = '<button type="button" data-id="' +
                        this.data[+i].id + '"  class="btn btn-success">Reinitialisez </button>';
                        this.data[+i]['rejetMail'] = '<button type="button" data-id="' +
                        this.data[+i].id + '"  class="btn btn-success">Rejeter Mail</button>';
                        this.data[+i]['rejetPseudo'] = '<button type="button" data-id="' +
                        this.data[+i].id + '"  class="btn btn-success">Rejeter Pseudo</button>';
                        if (this.data[+i].isActive === 1 && this.data[+i].statut === 0) {
                            // comte crée
                            this.data[+i]['btnActive'] = '<button type="button" data-id="' +
                            this.data[+i].id + '"  class="btn btn-success">Activer</button>';
                        } else if (this.data[+i].isActive === 2 && this.data[+i].statut === 0) {
                            // compte validé
                            this.data[+i]['btnActive'] = '<button type="button" data-id="' +
                            this.data[+i].id + '"  class="btn btn-success">Suspendre</button>';
                        } else if (this.data[+i].isActive === 2 && this.data[+i].statut === 1) {
                            // compte suspendu
                            this.data[+i]['btnActive'] = '<button type="button" data-id="' +
                            this.data[+i].id + '"  class="btn btn-success">Reprendre</button>';
                        } else {
                            this.data[+i]['btnActive'] = '';
                        }
                    }
                }
                this.rows = this.data;
                this.length = users.total;
                this.isLoading = false;
            },
            err => {
                this.errorMessage = err.message ? err.message : err;
                this.isLoading = false;
                // console.log("error");
            });
    }

    resetPassword(pseudo, idSite) {
        this.isLoading = true;
        this.alertCssClass = 'info';

        if (!this.authenticationApplicatifService.loggedIn()) {
            this.router.navigate(['/login']);
        } else {
        if (pseudo) {
            // this.userDetail.idSite = 4;
            this.authenticationApplicatifService.resetPassword (pseudo, idSite)
            .subscribe(res => {
                if (res.status === 200) {
                    this.isLoading = false;
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: '', detail: 'Rejet mot de passe avec succès' });
                } else {
                    this.hasError = true;
                    this.alertCssClass = 'danger';
                    if (res.error instanceof Array) {
                        if (res.error[0]){
                            // console.log(res.error[0]);
                            this.isLoading = false;
                            this.informationMessage = this.translateString(res.error[0]);

                        } else {
                            this.informationMessage = this.dataInvalid;
                        }
                    } else {
                    this.informationMessage = this.dataInvalid;
                    }
                }
            },
            err => {
                this.hasError = true;
                this.isLoading = false;
                this.alertCssClass = 'danger';
                this.informationMessage = this.wrongMailOrPassword;
            });

        }
        }
  }

userRejectPseudo(uid): void{
    this.isLoading = true;
    this.authenticationApplicatifService.resetPseudoOrMail(uid, false)
        .subscribe(res => {
          if (res.status === 200) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '', detail: 'Rejet pseudo avec succès' });
            this.isLoading = false;
          } else {
            this.hasError = true;
            this.isLoading = false;
          }
        },
          err => {
            this.hasError = true;
            this.isLoading = false;
            this.alertCssClass = 'danger';
            this.informationMessage = 'Une erreur se reproduit';
      });
  }

  userRejectMail(uid): void{
      this.isLoading = true;
      this.authenticationApplicatifService.resetPseudoOrMail(uid, true)
        .subscribe(res => {
          if (res.status === 200) {
            this.isLoading = false;
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '', detail: 'Rejet  mail avec succès' });
          } else {
            this.hasError = true;
            this.isLoading = false;
          }
        },
          err => {
            this.hasError = true;
            this.isLoading = false;
            this.alertCssClass = 'danger';
            this.informationMessage = 'Une erreur se reproduit';
      });
  }

  translateString (initString: string) : string {
      switch (initString) {
          case 'ActivationLink':
              return this.ResetPasswordLink;
          case 'userNotFoundLdap':
              return this.userNotFoundLdap;
          case 'connectionLdapFailed':
              return this.connectionLdapFailed;
          case 'passwordInvalid':
              return this.passwordInvalid;
          case 'codeConfirmationInvalid':
              return this.codeConfirmationInvalid;
          case 'adressEmailInvalid':
              return this.adressEmailInvalid;
          case 'DataInvalid':
              return this.dataInvalid;
          case 'inputEmpty':
              return this.inputEmpty;
          case 'notResult':
              return this.notResult;
          case 'resetPasswordFailed':
              return this.resetPasswordFailed;
          case 'userNotFound':
              return this.userNotFound;
          case 'mailSucces':
              return this.mailSucces;
          case 'timeOutConfirmation':
              return this.timeOutConfirmation;
          default:
              return this.dataInvalid;
        }
  }

  initTranslation () {
    this.translate.get('ResetPasswordLink').subscribe((res: string) => {
      this.ResetPasswordLink = res;
    });
    //
    this.translate.get('WrongMailOrPassword').subscribe((res: string) => {
      this.wrongMailOrPassword = res;
    });

    this.translate.get('userNotFoundLdap').subscribe((res: string) => {
      this.userNotFoundLdap = res;
    });
    this.translate.get('connectionLdapFailed').subscribe((res: string) => {
      this.connectionLdapFailed = res;
    });
    this.translate.get('passwordInvalid').subscribe((res: string) => {
      this.passwordInvalid = res;
    });
    this.translate.get('codeConfirmationInvalid').subscribe((res: string) => {
      this.codeConfirmationInvalid = res;
    });
    this.translate.get('adressEmailInvalid').subscribe((res: string) => {
      this.adressEmailInvalid = res;
    });
    this.translate.get('DataInvalid').subscribe((res: string) => {
      this.dataInvalid = res;
    });
    this.translate.get('inputEmpty').subscribe((res: string) => {
      this.inputEmpty = res;
    });
    this.translate.get('notResult').subscribe((res: string) => {
      this.notResult = res;
    });
    this.translate.get('resetPasswordFailed').subscribe((res: string) => {
      this.resetPasswordFailed = res;
    });
    this.translate.get('userNotFound').subscribe((res: string) => {
      this.userNotFound = res;
    });
    this.translate.get('mailSucces').subscribe((res: string) => {
      this.mailSucces = res;
    });
    this.translate.get('timeOutConfirmation').subscribe((res: string) => {
      this.timeOutConfirmation = res;
    });

  }

  deleteUser(uid) {
        this.isLoading = true;
        const args = {'uid': uid};
        this.administrationApplicatifServiceACI.deleteUser(args).subscribe(users => {
            this.loadUser();
        } , err => {
            this.errorMessage = err.message ? err.message : err;
            this.isLoading = false;
        });
  }

  public openConfirmModal(event) {
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        const modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        const data = {
            'title' : 'Confirmation suppression',
            'content' : 'Voulez-vous vraiment supprimer cet utilisateur ?'
        };

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data) {
                this.deleteUser(event);
            }
        });

    }

    updateUserStatutModerisation(): void {
      this.utilisateurApplicatifService.updateUserStatutModerisation(this.uid, this.itemSelected)
      .subscribe(res => {
          if (res.status === 200) {
            this.loadUser();
            this.childModal.hide();
          }else{
            this.hasError = true;
          }
        },
          err => {
            this.hasError = true;
            this.alertCssClass = 'danger';
      });
  }

  onDeleteCancel(){
      this.childModal.hide();
  }

  moderationChange(id) {
      this.itemSelected = id;
  }

    onRoleCancel() {
        this.rolesModal.hide();
    }

    updateUserRole() {
        this.utilisateurApplicatifService.updateUserRoles(this.uid, this.selectedroles)
        .subscribe(res => {
            if (res.status === 200) {
              this.loadUser();
              this.rolesModal.hide();
            } else {
              this.hasError = true;
            }
          },
            err => {
              this.hasError = true;
              this.alertCssClass = 'danger';
        });
    }
    public onSelect(selectedItem): void {
        this.selectRole(selectedItem);
    }

    selectRole(selectedItem) {
        const itemIndex = this.selectedroles.indexOf(selectedItem);
        if (this.selectedroles && itemIndex >= 0) {
            this.selectedroles.splice(itemIndex, 1);
        } else {
            this.selectedroles.push(selectedItem);
        }
    }

    public isSelected(currentItem): boolean {
        const itemExist = this.selectedroles.find(item => item === currentItem);
        return (!itemExist || this.selectedroles.length === 0) ? false : true;
    }

    public moderationChangeSearch(itemSelectedSearch){
        if (this.userCriteria&&itemSelectedSearch) {
            this.userCriteria.moderation = itemSelectedSearch;
        }
    }
}
