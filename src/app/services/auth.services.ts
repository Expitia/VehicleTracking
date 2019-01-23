import { SessionStorageService } from 'angular-web-storage';
import { Injectable } from '@angular/core';
import { HttputilsService } from './httputils.service';
import { UserIdleService } from 'angular-user-idle';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  constructor(private userIdle: UserIdleService, public httputils:HttputilsService,public session: SessionStorageService) { }

  sbUrl='/safe/api/services/users/'; 

  /**
   * Método encargado de realizar la petición de login.
   * @param obUser Usuario a ingresar
   */
  userLogin(obUser) {
    return this.httputils.loginPost(`${this.sbUrl}login.php`, obUser);
  }
}
