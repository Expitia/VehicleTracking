import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { toGTMformat } from "../../utils/dateutils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.services";
import { MaintenancesService } from "../../services/maintenances.services";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDatepicker,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { generateOrder } from '../../utils/vehiclepdf';

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
    //Se debe cargar de base de datos

    //this.maintenancesService.getMaintenances().then(resp => {
      /*  maintenances = maintenances.concat(
        resp.records.map(item => {
          return {
            ID: item.id,
            Detalle: item.id,
            "Fecha Final": item.fecha_salida
              ? new Date(item.fecha_salida)
              : "-",
            Tipo: "Preventivo",
            "Tipo Vehiculo": "Tractocamion",
            "Fecha Inicial": item.fecha_entrada,
            Usuario: "Juan Perez",
            "ID Vehiculo": item.id_equipo,
            "Tiempo Abajo": Math.floor(Math.random() * 100),
            Estado: this.statesList[Math.floor(Math.random() * 2)]
          };
        })
      );*/

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
      this.dataSource = new MatTableDataSource(maintenances);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    //});
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

  onDownloadPdf(row) {
    // createPDFTable('ORDEN DE SERVICIO - MANTENIMIENTO MECANICO', ['a', 'b', 'c'], [['1', '2', '3'], ['4', '5', '6']]);
    generateOrder();
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */

  ngOnInit() {}
}
