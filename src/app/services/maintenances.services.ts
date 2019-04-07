import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class MaintenancesService {
  constructor(public httputils: HttputilsService) {}

  sbUrl = "/safe/api/services/maintenances/get_maintenances.php";
  sbAlertsUrl = "/safe/api/services/maintenances/get_alerts.php";
  sbCreateMaintenanceUrl =
    "/safe/api/services/maintenances/create_maintenance_alert.php";

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

  /**
   * Método que realiza petición de alertas
   */
  getAlerts(): any {
    return this.httputils.post(`${this.sbAlertsUrl}`, {});
  }

  createMaintenanceByAlert(parameters): any {
    this.httputils.post(`${this.sbCreateMaintenanceUrl}`, parameters);
  }
}
