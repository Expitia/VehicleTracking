import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.services';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
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
  chart1 = {};
  chart2 = {};
  chart3 = {};

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
  ngOnInit() {
    this.chart1 = new Chart('rightChart', {
      type: 'horizontalBar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          {
            label: 'x1',
            data: [14, 12, 44, 50, 45, 6],
            backgroundColor: '#33ccff'
          },
          {
            label: 'x2',
            data: [20, 40, 14, 45, 4, 60],
            backgroundColor: '#ff6600'
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              stacked: true
            }
          ],
          yAxes: [
            {
              display: true,
              stacked: true
            }
          ]
        }
      }
    });

    this.chart2 = new Chart('mainChart', {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          {
            label: 'x1',
            data: [14, 12, 44, 50, 45, 6],
            backgroundColor: '#33ccff'
          },
          {
            label: 'x2',
            data: [20, 40, 14, 45, 4, 60],
            backgroundColor: '#ff6600'
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              display: true
            }
          ],
          yAxes: [
            {
              display: true
            }
          ]
        }
      }
    });

    this.chart3 = new Chart('leftChart', {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          {
            label: 'x1',
            data: [14, 12, 44, 50, 45, 6],
            backgroundColor: '#33ccff'
          },
          {
            label: 'x2',
            data: [20, 40, 14, 45, 4, 60],
            backgroundColor: '#ff6600'
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              display: true
            }
          ],
          yAxes: [
            {
              display: true
            }
          ]
        }
      }
    });
  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */
  ngAfterViewInit() {
    this.dashboardService.getVehicles().then(
      resp => {
        this.users = resp.usuarios_totales;
        this.alerts = resp.alertas;
        this.symptoms = resp.sintomas_vehiculos;
        this.vehicles = resp.vehiculos_totales;
        this.maintenances = resp.mantenimientos_totales;
        this.oils = resp.galones_consumidos;
      },
      err => {
        console.log(err);
      }
    );
  }
}
