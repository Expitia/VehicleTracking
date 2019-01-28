import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { toGTMformat } from "../../utils/dateutils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.services";
import { UserService } from "../../services/user.services";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html"
})

/**
 * @public
 * @class UsersComponent
 *
 * Clase para la información de los usuarios
 */
export class UsersComponent extends BaseComponent implements OnInit {
  // Columnas de despliegue en la vista
  displayedColumns = [
    "ID",
    "Nombre",
    "Apellido",
    "Email usuario",
    "Fecha de registro",
    "Rol",
    "Estado",
    "Detalle"
  ];
  // Columnas de exportación de datos
  rowsExcel = {
    ID: true,
    "Email usuario": true,
    "Fecha de registro": true,
    Rol: true,
    Estado: true
  };
  // Lista de estados del usuario
  statesList = [];
  // Lista de roles del usuario
  roleList = [];
  // Objeto para el filtro de información
  searchData = {
    email: "",
    date: null,
    rol: "",
    estado: ""
  };
  // Información de la tabla a visualizar
  dataSource: MatTableDataSource<any>;
  // Paginador de la tabla de usuarios
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Ordenador de la tabla de usuarios
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
    private userService: UserService
  ) {
    super(router, formBuilder);
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */
  ngOnInit() {
    // Información del formulario
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
      nombres: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Nombre usuario",
          minlength: "Los nombres debe tener un mínimo de 3 carracteres",
          maxlength: "Los nombres no puede superar los 100 carracteres",
          required: "Debe ingresar los nombres"
        }
      },
      apellidos: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Apellidos",
          minlength: "Los apellidos deben tener un mínimo de 3 carracteres",
          maxlength: "Los apellidos no pueden superar los 100 carracteres",
          required: "Debe ingresar los apellidos"
        }
      },
      email: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Email",
          minlength: "El email debe tener un mínimo de 3 carracteres",
          maxlength: "El email no puede superar los 100 carracteres",
          required: "Debe ingresar un email"
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
        required: true,
        messages: {
          label: "",
          placeholder: "Estado",
          minlength: "",
          maxlength: "",
          required: "Seleccione un estado valido"
        }
      },
      password: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Password",
          minlength: "El password ingresado en demasiado corto",
          maxlength: "",
          required: "Debe ingresar una contraseña para continuar"
        }
      }
    };
    super.ngOnInit();
  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */
  ngAfterViewInit() {
    // Obtenemos la información de los usuarios
    this.userService.userInfo().then(
      (resp: any) => {
        let users = resp.map((item: any) => {
          return {
            ID: item.id,
            Nombre: item.nombres,
            Apellido: item.apellidos,
            "Email usuario": item.email,
            Rol: item.roles_id, // Identificador del rol
            Estado: item.estados_id, // Identificador del estado
            "Fecha de registro": item.fecha_registro
          };
        });

        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data, filter) => {
          let blFilter = true;

          for (let key in this.searchData) {
            if (this.searchData[key]) {
              //El filtro por fecha
              if (key == "date") {
                const dateRow = data["Fecha de registro"]
                  .toLocaleString()
                  .split(" ")[0]
                  .replace(/\//g, "-");

                blFilter = blFilter && dateRow == this.searchData[key];
                //Filtro por rol
              } else if (key == "rol")
                blFilter = blFilter && data["Rol"] == this.searchData[key];
              //Filtro por estado
              else if (key == "estado")
                blFilter = blFilter && data["Estado"] == this.searchData[key];
              //Filtro por email
              else if (key == "email")
                blFilter =
                  blFilter &&
                  data["Email usuario"]
                    .toLowerCase()
                    .includes(this.searchData[key].toLowerCase());
            }
          }
          return blFilter;
        };
      },
      (error: any) => {
        console.error("Unable to load users data");
      }
    );
    // Obtenemos la información de los estados
    this.userService.stateList().then(
      (resp: any) => {
        this.statesList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });
      },
      (error: any) => {
        console.error("Unable to load state data");
      }
    );
    // Obtenemos la información de los roles
    this.userService.rolsList().then(
      (resp: any) => {
        this.roleList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });
      },
      (error: any) => {
        console.error("Unable to load rols data");
      }
    );
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

        excelRow["Rol"] = this.showRol(excelRow["Rol"]);
        excelRow["Estado"] = this.showState(excelRow["Estado"]);

        for (let key in this.rowsExcel) {
          if (!this.rowsExcel[key]) delete excelRow[key];
        }
        return excelRow;
      }),
      "Usuarios"
    );
  };

  /**
   * @private
   * @method onChangeFilter
   * Methodo handler lanzado al momento de escribir sobre un campo de filtro
   */
  onChangeFilter(filterValue: string, key: string) {
    this.searchData[key] = filterValue;
    this.dataSource.filter =
      this.dataSource.filter == filterValue || !filterValue
        ? Math.random() + ""
        : filterValue;
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
   * @method onChangeCheck
   * Methodo handler lanzado al momento de hacer click sobre un check
   */
  onChangeCheck(key: string) {
    this.rowsExcel[key] = !this.rowsExcel[key];
  }

  /**
   * @private
   * @method showDate
   * Methodo para visualizar las fechas
   */
  showDate(date: Date) {
    return date ? toGTMformat(date) : "-";
  }

  /**
   * @private
   * @method showState
   * Methodo para visualizar un estado dado el identificador
   */
  showState(id: number) {
    return this.statesList.filter(item => item.id == id)[0].description;
  }

  /**
   * @private
   * @method showRol
   * Methodo para visualizar un rol dado el identificador
   */
  showRol(id: number) {
    return this.roleList.filter(item => item.id == id)[0].description;
  }

  /**
   * @private
   * @method onEdit
   * Methodo para editar un usuario
   */
  onEdit() {
    let index = -1;
    this.formSubmitted = true;

    if (this.form.valid) {
      this.modalService.dismissAll();
      index = this.dataSource.data.findIndex(item => {
        return item.ID === this.form.value.id;
      });
      this.dataSource.data = this.dataSource.data.map((item, idx) => {
        let newItem = item;
        // En caso de corresponder al identificador que estamos buscando
        if (index === idx) {
          // Consumimos el servicio para editarlo
          this.userService.editUser({
            id: this.form.value.id,
            nombres: this.form.value.nombres,
            apellidos: this.form.value.apellidos,
            email: this.form.value.email,
            estados_id: this.form.value.status
          });
          // Si se cumple exitosamente editamos el objeto
          newItem = {
            ID: this.form.value.id,
            Nombre: this.form.value.nombres,
            Apellido: this.form.value.apellidos,
            "Email usuario": this.form.value.email,
            "Fecha de registro": item["Fecha de registro"],
            Rol: item["Rol"],
            Estado: this.form.value.status,
            Detalle: this.form.value.id
          };
        }
        return newItem;
      });
    }
  }

  /**
   * @private
   * @method onCreate
   * Methodo para crear un usuario
   */
  onCreate() {
    this.formSubmitted = true;

    if (this.form.valid) {
      this.modalService.dismissAll();
      this.userService
        .saveUser({
          nombres: this.form.value.nombres,
          apellidos: this.form.value.apellidos,
          email: this.form.value.email,
          estados_id: this.form.value.status,
          roles_id: this.form.value.role,
          password: this.form.value.password
        })
        .then((resp: any) => {
          // Si existe un ID es porque se editara un registro
          this.dataSource.data = this.dataSource.data.concat({
            ID: resp.id,
            Nombre: this.form.value.nombres,
            Apellido: this.form.value.apellidos,
            "Email usuario": this.form.value.email,
            "Fecha de registro": resp.fecha_registro,
            Rol: this.form.value.role,
            Estado: this.form.value.status,
            Detalle: resp.id
          });
        });
    }
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate() {
    this.form.controls.id.setValue("");
    this.form.controls.nombres.setValue("");
    this.form.controls.apellidos.setValue("");
    this.form.controls.email.setValue("");
    this.form.controls.role.setValue("");
    this.form.controls.status.setValue("");
    this.form.controls.register_date.setValue("");
    this.form.controls.password.setValue("");
    this.formSubmitted = false;
  }

  /**
   * @private
   * @method onOpenEdit
   * Methodo handler lanzado al momento dar click sobre la opción de editar
   */
  onOpenEdit(row) {
    this.form.controls.id.setValue(row["ID"]);
    this.form.controls.nombres.setValue(row["Nombre"]);
    this.form.controls.apellidos.setValue(row["Apellido"]);
    this.form.controls.email.setValue(row["Email usuario"]);
    this.form.controls.role.setValue(row["Rol"]);
    this.form.controls.status.setValue(row["Estado"]);
    this.form.controls.password.setValue(".....");
    this.formSubmitted = false;
  }
}
