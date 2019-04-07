import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { Component, OnInit } from "@angular/core";
import { HomeService } from "src/app/services/home.services";
import { Chart } from "chart.js";

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
  months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];
  users = 0;
  alerts = 0;
  symptoms = 0;
  vehicles = 0;
  maintenances = 0;
  oils = 0;

  // Información para manipulación de la tabla de disponibilidad por vehiculo del mes anterior
  availableById = {};
  availableByIdData = [];

  // Información para manipulación de la tabla de disponibilidad por vehiculo del año
  availableByIdYear = {};
  availableByIdYearData = [];

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
   * @method renderAvalaibleByIdYearTable
   * Methodo que retorna la grafica de disponibilidad de vehiculos del año
   */
  renderAvalaibleByIdYearTable() {
    const ctx = (document.getElementById(
      "availableByIdYear"
    ) as any).getContext("2d");
    const chartData = {
      type: "bar",
      data: {
        labels: this.availableByIdYearData.map(
          item => `${item.id} - ${item.descripcion}`
        ),
        datasets: [
          {
            label: "Disponibilidad (%)",
            data: this.availableByIdYearData.map(item =>
              item.disponibilidad > 100 || !item.disponibilidad
                ? 100
                : item.disponibilidad
            ),
            backgroundColor: "#33ccff"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: function(animation) {
            setTimeout(function() {
              const sourceCanvas = this.availableByIdYear.chart.canvas;
              const copyWidth =
                this.availableByIdYear.scales["y-axis-0"].width - 10;
              const copyHeight =
                this.availableByIdYear.scales["y-axis-0"].height +
                this.availableByIdYear.scales["y-axis-0"].top +
                10;
              const targetCtx = (document.getElementById(
                "availableByIdYear"
              ) as any).getContext("2d");
              targetCtx.canvas.width = copyWidth;
              targetCtx.drawImage(
                sourceCanvas,
                0,
                0,
                copyWidth,
                copyHeight,
                0,
                0,
                copyWidth,
                copyHeight
              );
            }, 3000);
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                max: 100,
                beginAtZero: true
              },
              barThickness: 40
            }
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        }
      }
    };

    const newwidth = this.availableByIdYearData.length * 30 + 100; //50 padding
    (document.getElementsByClassName(
      "chartAreaWrapper2"
    )[1] as any).style.width = newwidth + "px";

    this.availableByIdYear = new Chart(ctx, chartData);

    return this.availableByIdYear;
  }

  /**
   * @private
   * @method renderAvalaibleByIdTable
   * Methodo que retorna la grafica de disponibilidad de vehiculos
   */
  renderAvalaibleByIdTable() {
    const ctx = (document.getElementById("availableById") as any).getContext(
      "2d"
    );
    const chartData = {
      type: "bar",
      data: {
        labels: this.availableByIdData.map(
          item => `${item.id} - ${item.descripcion}`
        ),
        datasets: [
          {
            label: "Disponibilidad (%)",
            data: this.availableByIdData.map(item =>
              item.disponibilidad > 100 || !item.disponibilidad
                ? 100
                : item.disponibilidad
            ),
            backgroundColor: "#33ccff"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: function(animation) {
            setTimeout(function() {
              const sourceCanvas = this.availableById.chart.canvas;
              const copyWidth =
                this.availableById.scales["y-axis-0"].width - 10;
              const copyHeight =
                this.availableById.scales["y-axis-0"].height +
                this.availableById.scales["y-axis-0"].top +
                10;
              const targetCtx = (document.getElementById(
                "availableById"
              ) as any).getContext("2d");
              targetCtx.canvas.width = copyWidth;
              targetCtx.drawImage(
                sourceCanvas,
                0,
                0,
                copyWidth,
                copyHeight,
                0,
                0,
                copyWidth,
                copyHeight
              );
            }, 3000);
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                max: 100,
                beginAtZero: true
              },
              barThickness: 40
            }
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        }
      }
    };

    const newwidth = this.availableByIdData.length * 30 + 100; //50 padding
    (document.getElementsByClassName(
      "chartAreaWrapper2"
    )[0] as any).style.width = newwidth + "px";

    this.availableById = new Chart(ctx, chartData);

    return this.availableById;
  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */
  ngAfterViewInit() {
    this.addMask("getVehicles");
    this.dashboardService.getVehicles().then(
      resp => {
        this.users = resp.usuarios_totales;
        this.alerts = resp.alertas;
        this.symptoms = resp.sintomas_vehiculos;
        this.vehicles = resp.vehiculos_totales;
        this.maintenances = resp.mantenimientos_totales;
        this.oils = resp.galones_consumidos;

        this.availableByIdData = resp.vehiculos_mensual;
        this.renderAvalaibleByIdTable();

        this.availableByIdYearData = resp.vehiculos_anual;
        this.renderAvalaibleByIdYearTable();

        this.removeMask("getVehicles");
      },
      err => {
        console.log(err);
      }
    );
  }
}
