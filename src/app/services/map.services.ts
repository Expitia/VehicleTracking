import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class MapService {
  constructor(public httputils: HttputilsService) {}

  sbUrl = "/safe/api/services/maps/";

  /**
   * Método que realiza petición de mantenimientos
   */
  getVehicles(): any {
    return this.httputils.post(`${this.sbUrl}get_vehicles`, {});
  }
}
