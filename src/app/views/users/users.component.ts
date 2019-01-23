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
  selector: 'app-users',
  templateUrl: './users.component.html'
})

/**
 * @public
 * @class UsersComponent
 * 
 * Clase para la información de los usuarios
 */
export class UsersComponent extends BaseComponent implements OnInit {

  displayedColumns = [
    'ID',
    "Nombre",
    "Apellido",
    "Email usuario",
    "Fecha de registro",
    "Rol",
    'Estado',
    "Detalle"
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
      nombre: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Nombre usuario",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      apellido: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Apellidos",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      email: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Email",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      register_date: {
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
      role: {
        minlength: "",
        maxlength: "",
        required: true,
        messages: {
          label: "",
          placeholder: "Rol del usuario",
          minlength: "",
          maxlength: "",
          required: "Seleccione un rol valido"
        }
      },
      status: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Estado",
          minlength: "",
          maxlength: "",
          required: ""
        }
      }
    };

    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    super.ngOnInit();
  }

  /**
   * @private
   * @method ngAfterViewInit 
   * Methodo del ciclo de vida de la vista
   */  
  ngAfterViewInit() {
    //Se debe cargar de base de datos
    let users = [];
    
    this.userService.userInfo().then((resp: any) => {
      users = users.concat(resp.map((item: any) => {
        return {
            'ID': item.id,
            "Nombre": item.nombres,
            "Apellido": item.apellidos,
            "Email usuario": item.email,
            'Fecha de registro': item.fecha_registro,
            "Rol": item.rol,
            "Estado": item.estado
          }; 
      }));

      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error: any) => {
      console.error("Unable to load data");
    });
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

    this.excelService.exportAsExcelFile(this.dataSource.data.map(item => {
      let excelRow = {...item};

      for(let key in this.rowsExcel){
        if(!this.rowsExcel[key]) delete excelRow[key];
      }
      return excelRow;
    }), 'Usuarios');
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
   * @method onOpenModal
   * Methodo handler lanzado al momento dar click sobre una opción
   */
  onOpenModal(content, long) {
    const size = long || "lg";
    this.modalService.open(content, { centered: true, size });
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate() {
    this.form.controls.id.setValue("");
    this.form.controls.email.setValue("");
    this.form.controls.register_date.setValue(this.showDate(new Date()));
    this.form.controls.role.setValue("");
    this.form.controls.status.setValue("");
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

  onCreate(){
    let index = -1;

    this.formSubmitted = true;

    if (this.form.valid){
      debugger;
      if (this.form.value.id){
        index = this.dataSource.data.findIndex(item => {
          return item.ID === this.form.value.id; 
        });
        /*
        this.dataSource.data[index] = {
          ID: this.form.value.id,
          Nombre: this.form.value.nombre,
          Apellido: this.form.value.apellido,
          "Email usuario": this.form.value.email,
          "Fecha de registro": this.form.value.register_date,
          Rol: this.form.value.role,
          Estado: this.form.value.status
        };
        */
        this.dataSource.data = this.dataSource.data.map((item, idx) => {
          if (index === idx){
            return {
              ID: this.form.value.id,
              Nombre: this.form.value.nombre,
              Apellido: this.form.value.apellido,
              "Email usuario": this.form.value.email,
              "Fecha de registro": this.form.value.register_date,
              Rol: this.form.value.role,
              Estado: this.form.value.status
            }
          } else {
            return item;
          }
        });
      }else{
        this.dataSource.data = this.dataSource.data.concat({
          ID: Math.round(Math.random()*50),
          Nombre: this.form.value.nombre,
          Apellido: this.form.value.apellido,
          "Email usuario": this.form.value.email,
          "Fecha de registro": this.form.value.register_date,
          Rol: this.form.value.role,
          Estado: this.form.value.status
        });
      }
    }
  }

  /**
   * @private
   * @method onOpenEdit
   * Methodo handler lanzado al momento dar click sobre la opción de editar
   */
  onOpenEdit(row) {
    this.form.controls.id.setValue(row["ID"]);
    this.form.controls.nombre.setValue(row["Nombre"]);
    this.form.controls.apellido.setValue(row["Apellido"]);
    this.form.controls.email.setValue(row["Email usuario"]);
    this.form.controls.role.setValue(row["Rol"]);
    this.form.controls.status.setValue(row["Estado"]);
  }

}
