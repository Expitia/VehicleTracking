import { Injectable } from "@angular/core";
import { HttputilsService } from "./httputils.service";

@Injectable({
  providedIn: "root"
})
export class ComponentsService {
  constructor(public httputils: HttputilsService) {}

  sbModelsUrl = "/safe/api/services/models/";
  sbSystemsUrl = "/safe/api/services/systems/";
  sbVehiclesUrl = "/safe/api/services/vehicles/";
  sbCatalogsUrl = "/safe/api/services/catalogs/";
  sbActivitiesUrl = "/safe/api/services/activities/";
  sbCompartmentsUrl = "/safe/api/services/compartments/";

  /**
   * Método que realiza petición para traer los tipos de vehículos
   */
  getVehiclesType() {
    return this.httputils.post(`${this.sbVehiclesUrl}get_types.php`, {});
  }

  /**
   * Método que realiza petición para traer los modelos
   */
  getModels() {
    return this.httputils.post(`${this.sbVehiclesUrl}get_models.php`, {});
  }

  /**
   * Método que realiza petición para traer los sistemas
   */
  getSystems() {
    return this.httputils.post(`${this.sbSystemsUrl}get_systems.php`, {});
  }

  /**
   * Método que realiza petición para traer los compartimientos
   */
  getCompartments() {
    return this.httputils.post(`${this.sbCompartmentsUrl}get_compartments.php`, {});
  }

  /**
   * Método que realiza petición para traer las actividades
   */
  getActivities() {
    return this.httputils.post(`${this.sbActivitiesUrl}get_activities.php`, {});
  }

  /**
   * Método que realiza petición para traer los catálogos
   */
  getCatalogs() {
    return this.httputils.post(`${this.sbCatalogsUrl}get_catalogs.php`, {});
  }

  /**
   * Método que realiza petición para traer las actividades
   */
  getAlerts() {
    return this.httputils.post(`${this.sbCatalogsUrl}get_alerts.php.php`, {});
  }

  /**
   * Método que realiza petición para crear un nuevo modelo
   */
  createModel(parameters) {
    return this.httputils.post(`${this.sbModelsUrl}create_model.php`, parameters);
  }

  /**
   * Método que realiza petición para crear un nuevo sistema
   */
  createSystem(parameters) {
    return this.httputils.post(`${this.sbSystemsUrl}create_system.php`, parameters);
  }

  /**
   * Método que realiza petición para crear un nuevo compartimiento
   */
  createCompartment(parameters) {
    return this.httputils.post(`${this.sbCompartmentsUrl}create_compartment.php`, parameters);
  }


  /**
   * Método que realiza petición para crear una nueva actividad
   */
  createActivity(parameters) {
    return this.httputils.post(`${this.sbActivitiesUrl}create_activity.php`, parameters);
  }



  
}
