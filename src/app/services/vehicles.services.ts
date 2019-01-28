import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class VehicleService {
  constructor(public httputils: HttputilsService) {}

  sbUrl = "/safe/api/services/vehicles/";

  /**
   * Método que realiza petición para traer los vehiculos
   */
  getVehicles(): any {
    return this.httputils.post(`${this.sbUrl}get_vehicles.php`, {});
  }

  /**
   * Método que realiza petición para traer los tipos de vehiculos
   */
  getTypes(): any {
    return this.httputils.post(`${this.sbUrl}get_types.php`, {});
  }

  /**
   * Método que realiza petición para traer los modelos de los vehiculos
   */
  getModels(): any {
    return this.httputils.post(`${this.sbUrl}get_models.php`, {});
  }

  /**
   * Método que realiza petición para crear un nuevo vehiculo
   */
  createVehicle(body): any {
    return this.httputils.post(`${this.sbUrl}create_vehicle.php`, body);
  }

  /**
   * Método que realiza petición para crear un nuevo vehiculo
   */
  updateVehicle(body): any {
    return this.httputils.post(`${this.sbUrl}update_vehicle.php`, body);
  }
}
