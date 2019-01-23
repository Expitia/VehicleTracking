import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.services";
import { Component, OnInit, ViewChild } from "@angular/core";
import { VehicleService } from "src/app/services/vehicles.services";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { toGTMformat } from "src/app/utils/dateutils";

@Component({
  selector: "app-datailsvehicles",
  templateUrl: "./detailsvehicles.component.html"
})

/**
 * @public
 * @class VehiclesComponent
 *
 * Clase para la vista e inventariado de vehiculos
 */
export class DetailsvehicleComponent extends BaseComponent implements OnInit {
  id: string = "53";
  name: string = "Camion D53";
  type: string = "Camion";
  modelo: string = "UX-03";
  vehicleData: any = {};

  generalColumns = [
    "Horometro",
    "Temperatura",
    "Combustible",
    "RPM",
    "Estado",
    "Proximo Mantenimiento"
  ];

  availableColumns = [
    "Mes",
    "No. Mantenimientos",
    "No. Averias",
    "Disponibilidad",
    "Tiempo Abajo"
  ];
  statesList = ["En proceso", "Resuelto"];
  typeList = ["Correctivo", "Preventivo"];
  maintenanceColumns = [
    "ID",
    "ID Vehiculo",
    "Tipo del Vehiculo",
    "Fecha Inicial",
    "Fecha Final",
    "Tipo",
    "Usuario",
    "Tiempo Abajo",
    "Estado",
    "Detalle"
  ];

  maintenanceSearchData = {
    type: "",
    state: "",
    end: null,
    start: null
  };

  generalSource: MatTableDataSource<any>;
  availableSource: MatTableDataSource<any>;
  maintenanceSource: MatTableDataSource<any>;

  @ViewChild("availableMatPaginator") availablePaginator: MatPaginator;
  @ViewChild("maintenanceMatPaginator") maintenancePaginator: MatPaginator;
  @ViewChild(MatSort) maintenanceSort: MatSort;

  /**
   * @private
   * @method constructor
   */
  constructor(
    router: Router,
    formBuilder: FormBuilder,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private vehicleService: VehicleService
  ) {
    super(router, formBuilder);
  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */
  ngAfterViewInit() {
    this.generalSource = new MatTableDataSource([
      {
        Horometro: 3005,
        Temperatura: 25,
        Combustible: 1240,
        RPM: 340,
        Estado: "Trabajando",
        "Proximo Mantenimiento": 140,
        "Tipo Mantenimiento": "Horas" //Dato usado para calcular no se despliega en pantalla
      }
    ]);
    this.availableSource = new MatTableDataSource([
      {
        Mes: "Junio",
        "No. Mantenimientos": 5,
        "No. Averias": 5,
        Disponibilidad: 10,
        "Tiempo Abajo": 250
      },
      {
        Mes: "Mayo",
        "No. Mantenimientos": 25,
        "No. Averias": 35,
        Disponibilidad: 20,
        "Tiempo Abajo": 120
      }
    ]);
    this.availableSource.paginator = this.availablePaginator;

    //Se debe cargar de base de datos
    let maintenances = [];
    for (let i = 1; i <= 20; i++) {
      maintenances.push({
        ID: i,
        Detalle: i,
        "Fecha Final": null,
        Tipo: "Preventivo",
        Usuario: "Juan Perez",
        "Fecha Inicial": new Date(),
        "Tipo del Vehiculo": "Tractocamion",
        "ID Vehiculo": Math.floor(Math.random() * 1000),
        "Tiempo Abajo": Math.floor(Math.random() * 100),
        Estado: this.statesList[Math.floor(Math.random() * 2)]
      });
    }
    this.maintenanceSource = new MatTableDataSource(maintenances);
    this.maintenanceSource.paginator = this.maintenancePaginator;
    this.maintenanceSource.sort = this.maintenanceSort;
    this.maintenanceSource.filterPredicate = (data, filter) => {
      let blFilter = true;

      for (let key in this.maintenanceSearchData) {
        if (this.maintenanceSearchData[key]) {
          if (key == "start" || key == "end") {
            let values = this.maintenanceSearchData[key].split("-"),
              value = new Date(values[0], values[1] - 1, values[2]);

            key == "end"
              ? (blFilter = blFilter && data["Fecha Final"] <= value)
              : null;
            key == "start"
              ? (blFilter = blFilter && data["Fecha Inicial"] >= value)
              : null;
          } else if (key == "type")
            blFilter =
              blFilter &&
              data["Tipo"].includes(this.maintenanceSearchData[key]);
          else if (key == "state")
            blFilter =
              blFilter &&
              data["Estado"].includes(this.maintenanceSearchData[key]);
        }
      }
      return blFilter;
    };
  }

  /**
   * @private
   * @method onMaxHours
   * Methodo para visualizar las fechas
   */

  showDate(date: Date) {
    return date ? toGTMformat(date) : "-";
  }

  /**
   * @private
   * @method onOpenModal
   * Methodo handler lanzado al momento dar click sobre una opción
   */
  onOpenModal(content) {
    this.modalService.open(content, { centered: true, size: "md" } as any);
  }

  /**
   * @private
   * @method onOpenEdit
   * Methodo handler lanzado al momento dar click sobre la opción de editar
   */
  onOpenEdit() {
    this.form.controls.id.setValue(this.vehicleData["ID"]);
    this.form.controls.name.setValue(this.vehicleData["Nombre"]);
    this.form.controls.hours.setValue(this.vehicleData["Horas Configuradas"]);
    this.form.controls.distance.setValue(
      this.vehicleData["Distancia Configurada"]
    );
    this.form.controls.typeList.setValue(this.vehicleData["ID Tipo"]);
    this.form.controls.modelList.setValue(this.vehicleData["ID Modelo"]);
    this.form.controls.horometer.setValue(
      this.vehicleData["Horometro Configurado"]
    );
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */
  ngOnInit() {
    //Indicamos las reglas de los campos
    this.fieldProps = {
      id: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      name: {
        minlength: "3",
        maxlength: "10",
        required: true,
        messages: {
          label: "",
          placeholder: "Nombre",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      model: {
        minlength: "",
        maxlength: "",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo del vehiculo",
          minlength: "",
          maxlength: "",
          required: "Se debe registrar un modelo valido"
        }
      },
      type: {
        minlength: "",
        maxlength: "",
        required: true,
        messages: {
          label: "",
          placeholder: "Tipo de vehiculo",
          minlength: "",
          maxlength: "",
          required: "Se debe registrar un tipo valido"
        }
      },
      horometer: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Unidades de horometro entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      hours: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Horas entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      distance: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Distancia recorrida entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      }
    };
    super.ngOnInit();
  }
}
