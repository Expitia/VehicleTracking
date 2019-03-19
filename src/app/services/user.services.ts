import { SessionStorageService } from "angular-web-storage";
import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";
import { UserIdleService } from "angular-user-idle";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private userIdle: UserIdleService,
    public httputils: HttputilsService,
    public session: SessionStorageService
  ) {}

  sbUrl = "/safe/api/services/users/";

  /**
   * Método encargado de realizar la petición para obtener los usuarios.
   */
  userInfo() {
    return this.httputils.post(`${this.sbUrl}get_users.php`, {});
  }

  /**
   * Método encargado de realizar la petición para obtener los usuarios.
   */
  userDetail(parameters) {
    return this.httputils.post(`${this.sbUrl}get_user.php`, parameters);
  }

  /**
   * Método encargado de realizar la petición para obtener los estados de los usuarios.
   */
  stateList() {
    return this.httputils.post(`${this.sbUrl}get_states.php`, {});
  }

  /**
   * Método encargado de realizar la petición para obtener los roles de los usuarios.
   */
  rolsList() {
    return this.httputils.post(`${this.sbUrl}get_rols.php`, {});
  }

  /**
   * Método encargado de realizar la petición para editar un usuario.
   */
  editUser(parameters) {
    return this.httputils.post(`${this.sbUrl}update_user.php`, parameters);
  }

  /**
   * Método encargado de realizar la petición para crear un usuario.
   */
  saveUser(parameters) {
    console.log(parameters);
    return this.httputils.post(`${this.sbUrl}create_user.php`, parameters);
  }
}
