import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class VehicleService {
  constructor(public httputils: HttputilsService) {}

  sbUrl='/safe/api/services/vehicles/'; 

  /**
   * Método que realiza petición para traer los vehiculos
   */
  getVehicles(): any {
    return new Promise((resolve, reject) => {
      this.httputils.post(`${this.sbUrl}get_vehicles.php`, {}).then(
        obResponse => {
          resolve(obResponse);
        },
        error => {
          reject();
        }
      );
    });
  }

  
  /**
   * Método que realiza petición para crear un nuevo vehiculo
   */
  createVehicle(body): any {
    return new Promise((resolve, reject) => {
      this.httputils.post(`${this.sbUrl}create_vehicle.php`, body).then(
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
