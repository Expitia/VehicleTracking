import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class HomeService {
  constructor(public httputils: HttputilsService) {}

  sbUrl = "/safe/api/services/dashboard/";

  /**
   * Método que realiza petición para traer los vehiculos
   */
  getVehicles(): any {
    return new Promise((resolve, reject) => {
      this.httputils.post(`${this.sbUrl}get_dashboard.php`, {}).then(
        obResponse => {
          resolve(obResponse);
        },
        error => {
          reject();
        }
      );
    });
  }
}
