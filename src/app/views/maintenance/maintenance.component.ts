import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { toGTMformat } from "../../utils/dateutils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.services";
import { MaintenancesService } from "../../services/maintenances.services";
import {
  MatDatepicker,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatTabGroup
} from "@angular/material";
import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-maintenance",
  templateUrl: "./maintenance.component.html"
})

/**
 * @public
 * @class MaintenanceComponent
 *
 * Clase para visualizar el listado de mantenimientos
 */
export class MaintenanceComponent extends BaseComponent implements OnInit {
  displayedColumns = [
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

  alertsColumns = ["ID", "Nombre", "Detalle"];

  rowsExcel = {
    ID: true,
    "ID Vehiculo": true,
    "Tipo del Vehiculo": true,
    "Fecha Inicial": true,
    "Fecha Final": true,
    Tipo: true,
    Usuario: true,
    "Tiempo Abajo": true,
    Estado: true
  };

  statesList = ["En proceso", "Resuelto"];

  typeList = ["Correctivo", "Preventivo"];

  searchData = {
    type: "",
    state: "",
    end: null,
    start: null
  };

  dataSource: MatTableDataSource<any>;
  alertsSource: MatTableDataSource<any>;

  @ViewChild("matGroup") matTabGroup: MatTabGroup;
  @ViewChild("alertsPaginator") alertsPaginator: MatPaginator;
  @ViewChild(MatSort) alertsSort: MatSort;

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * @private
   * @method constructor
   */

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private maintenancesService: MaintenancesService
  ) {
    super(router, formBuilder);
  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */
  ngAfterViewInit() {
    this.addMask("getMaintenances");
    //Se debe cargar de base de datos
    this.maintenancesService.getMaintenances().then((resp: any) => {
      //Se debe cargar de base de datos
      let maintenances = [];
      for (let i = 0; i < resp.length; i++) {
        let maintenance = resp[i];
        maintenances.push({
          ID: i,
          Detalle: i,
          "ID Vehiculo": maintenance.equipos_id,
          "Fecha Final": maintenance.fecha_salida,
          Tipo: maintenance.tipo,
          Usuario: "Juan Perez",
          "Fecha Inicial": maintenance.fecha_entrada,
          "Tipo del Vehiculo": "Tractocamion",
          "Tiempo Abajo": Math.floor(Math.random() * 100),
          Estado: maintenance.estado
        });
      }
      this.dataSource = new MatTableDataSource(maintenances);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (data, filter) => {
        let blFilter = true;

        for (let key in this.searchData) {
          if (this.searchData[key]) {
            if (key == "minNext")
              blFilter =
                blFilter &&
                data["Próximo Mantenimiento"] >= this.searchData[key];
            else if (key == "maxNext")
              blFilter =
                blFilter &&
                data["Próximo Mantenimiento"] <= this.searchData[key];
            else if (key == "type")
              blFilter = blFilter && data["Tipo"] == this.searchData[key];
            else if (key == "model")
              blFilter = blFilter && data["Modelo"] == this.searchData[key];
            else if (key == "state")
              blFilter =
                blFilter && data["Estado"].includes(this.searchData[key]);
          }
        }
        return blFilter;
      };

      this.dataSource.filterPredicate = (data, filter) => {
        let blFilter = true;

        for (let key in this.searchData) {
          if (this.searchData[key]) {
            if (key == "start" || key == "end") {
              let values = this.searchData[key].split("-"),
                value = new Date(values[0], values[1] - 1, values[2]);

              key == "end"
                ? (blFilter = blFilter && data["Fecha Final"] <= value)
                : null;
              key == "start"
                ? (blFilter = blFilter && data["Fecha Inicial"] >= value)
                : null;
            } else if (key == "type")
              blFilter =
                blFilter && data["Tipo"].includes(this.searchData[key]);
            else if (key == "state")
              blFilter =
                blFilter && data["Estado"].includes(this.searchData[key]);
          }
        }
        return blFilter;
      };
      this.removeMask("getMaintenances");
    });

    this.addMask("getAlerts");
    // Actividades
    this.maintenancesService.getAlerts().then((resp: any) => {
      let alerts = [];
      for (let i = 0; i < resp.length; i++) {
        let alert = resp[i];
        alerts.push({
          ID: alert.id,
          Nombre: alert.descripcion
        });
      }
      this.alertsSource = new MatTableDataSource(alerts);
      this.alertsSource.paginator = this.alertsPaginator;
      this.alertsSource.sort = this.alertsSort;
      this.removeMask("getAlerts");
    });
  }
  /**
   * @private
   * @method onOpenExport
   * Methodo handler lanzado al momento dar click sobre exportar
   */

  onOpenExport(content) {
    this.modalService.open(content, { centered: true, size: "lg" });
  }

  /**
   * @private
   * @method onExport
   * Methodo handler lanzado al momento de exportar los estilos
   */
  onExport = function() {
    this.excelService.exportAsExcelFile(
      this.dataSource.data.map(item => {
        let excelRow = { ...item };
        excelRow["Tiempo Abajo"] = excelRow["Tiempo Abajo"] + " Horas";

        delete excelRow["Detalle"];

        for (let key in this.rowsExcel) {
          if (!this.rowsExcel[key]) delete excelRow[key];
        }
        return excelRow;
      }),
      "Mantenimientos"
    );
  };

  /**
   * @private
   * @method onExport
   * Methodo handler lanzado al momento de exportar los estilos
   */
  onCreateMaintenance = function() {
    this.addMask("createMaintenanceByAlert");
    // Actividades
    this.maintenancesService.createMaintenanceByAlert().then((resp: any) => {
      let alerts = [];
      for (let i = 0; i < resp.length; i++) {
        let alert = resp[i];
        alerts.push({
          ID: alert.id,
          Nombre: alert.descripcion
        });
      }
      this.alertsSource = new MatTableDataSource(alerts);
      this.alertsSource.paginator = this.alertsPaginator;
      this.alertsSource.sort = this.alertsSort;
      this.removeMask("createMaintenanceByAlert");
    });
  };

  /**
   * @private
   * @method onMaxHours
   * Methodo handler lanzado al momento de escribir sobre un campo de filtro
   */

  onChangeFilter(filterValue: string, key: string) {
    this.searchData[key] = filterValue;
    this.dataSource.filter = filterValue;
  }

  /**
   * @private
   * @method onMaxHours
   * Methodo handler lanzado al momento de hacer click sobre un check
   */

  onChangeCheck(key: string) {
    this.rowsExcel[key] = !this.rowsExcel[key];
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
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */

  ngOnInit() {}
}
