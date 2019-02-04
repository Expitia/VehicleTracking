import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class MapService {
  constructor(public httputils: HttputilsService) {}

  sbUrl = "/safe/api/services/maps/";
  sbTypesUrl = "/safe/api/services/vehicles/";

  /**
   * Método que realiza petición de mantenimientos
   */
  getVehicles(): any {
    return this.httputils.post(`${this.sbUrl}get_vehicles.php`, {});
  }

  /**
   * Método que realiza petición para traer los tipos de vehiculos
   */
  getTypes() {
    return this.httputils.post(`${this.sbTypesUrl}get_types.php`, {});
  }
}
