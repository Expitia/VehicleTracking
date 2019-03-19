import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class MaintenancesService {
  constructor(public httputils: HttputilsService) {}

  sbUrl = "/safe/api/services/maintenances/get_maintenances.php";

  /**
   * Método que realiza petición de mantenimientos
   */
  getMaintenances(): any {
    return this.httputils.post(`${this.sbUrl}`, {});
  }

  /**
   * Método que realiza petición de mantenimientos
   */
  getMaintenanceDetail(parameters): any {
    return this.httputils.post(`${this.sbUrl}`, parameters);
  }
}
