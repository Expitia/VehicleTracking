import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class ComponentsService {
  constructor(public httputils: HttputilsService) {}

  sbVehiclesUrl = "/safe/api/services/models/";
  sbSystemsUrl = "/safe/api/services/systems/";

  /**
   * Método que realiza petición para traer los modelos
   */
  getVehiclesType() {
    return this.httputils.post(`${this.sbVehiclesUrl}get_models.php`, {});
  }

  
}
