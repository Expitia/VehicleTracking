import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { Component, OnInit } from "@angular/core";
import { HomeService } from "src/app/services/home.services";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html"
})

/**
 * @public
 * @class HomeComponent
 *
 * Clase para la vista de inicio de la aplicación
 */
export class HomeComponent extends BaseComponent implements OnInit {
  users = 0;
  alerts = 0;
  symptoms = 0;
  vehicles = 0;
  maintenances = 0;
  oils = 0;

  /**
   * @private
   * @method constructor
   */

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    private dashboardService: HomeService
  ) {
    super(router, formBuilder);
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */

  ngOnInit() {}

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */

  ngAfterViewInit() {
    this.dashboardService.getVehicles().then(resp => {
      this.users = resp.usuarios_totales;
      this.alerts = resp.alertas;
      this.symptoms = resp.sintomas_vehiculos;
      this.vehicles = resp.vehiculos_totales;
      this.maintenances = resp.mantenimientos_totales;
      this.oils = resp.galones_consumidos;
    });
  }
}
