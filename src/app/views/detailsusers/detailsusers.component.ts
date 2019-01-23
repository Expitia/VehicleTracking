import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { toGTMformat } from '../../utils/dateutils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../services/excel.services';
import { UserService } from '../../services/user.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-detailsusers',
  templateUrl: './detailsusers.component.html'
})

/**
 * @public
 * @class UsersComponent
 * 
 * Clase para la información de los usuarios
 */
export class DetailsUsersComponent extends BaseComponent implements OnInit {

  displayedColumns = [
    'ID',
    "Email usuario",
    "Fecha de registro",
    "Rol",
    'Estado'
  ];

  rowsExcel = {
    'ID': false,
    "Email usuario": true,
    "Fecha de registro": true,
    "Rol": true,
    'Estado': true
  }

  statesList = [
    "OK"
  ];

  roleList = [
    "admin"
  ];

  searchData = {
    "email": "",
    "date": null,
    "rol": "",
    "estado": ""
  };

  dataSource: MatTableDataSource<any>;

  currentUser = {
    ID: 12,
    email: "test@gysa.com",
    date: new Date(),
    role: "admin",
    state: "OK"
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  
  /**
	 * @private
	 * @method constructor
	 */	
  constructor(router: Router, formBuilder: FormBuilder, private modalService: NgbModal, private excelService:ExcelService, private userService:UserService) { 
    super(router, formBuilder);
  }
  
  /**
	 * @private
	 * @method ngOnInit 
	 * Methodo del ciclo de vida de la vista
	 */	
  ngOnInit() {
    let users;

     users = [{
      'ID': 12,
            "Email usuario": "test@lsa.com",
            'Fecha de registro': new Date(),
            "Rol": this.roleList[0],
            "Estado": "OK"
    }];

    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @private
   * @method ngAfterViewInit 
   * Methodo del ciclo de vida de la vista
   */  
  ngAfterViewInit() {
    //Se debe cargar de base de datos
    let users = [];
    
    /*
    this.userService.userInfo({email: "test@test.com"}).then((resp: any) => {
      users = users.concat(resp.user_info.map((item: any) => {
        return {
            'ID': item.id,
            "Email usuario": item.email,
            'Fecha de registro': item.reg_date ? new Date(item.reg_date) : "-",
            "Rol": item.role,
            "Estado": item.state
          }; 
      }));

      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error: any) => {
      console.error("Unable to load data");
    });
    */

    users = [{
      'ID': 12,
            "Email usuario": "test@lsa.com",
            'Fecha de registro': new Date(),
            "Rol": this.roleList[0],
            "Estado": "OK"
    }];

    this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

  
  /**
   * @private
   * @method onOpenExport 
   * Methodo handler lanzado al momento dar click sobre exportar
   */  
  onOpenExport(content) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

    /**
   * @private
   * @method onExport 
   * Methodo handler lanzado al momento de exportar los estilos
   */  
  onExport = function() {

    this.excelService.exportAsExcelFile([this.currentUser].map(item => {
      let excelRow = {...item};

      for(let key in this.rowsExcel){
        if(!this.rowsExcel[key]) delete excelRow[key];
      }
      return excelRow;
    }), 'DetailsUsers');
  }

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
  showDate(date: Date){

    return date ? toGTMformat(date): "-";
  }

}
