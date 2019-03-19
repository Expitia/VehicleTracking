import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { toGTMformat } from '../../utils/dateutils';
import { UserService } from '../../services/user.services';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-detailsmaintenances',
  templateUrl: './detailsmaintenances.component.html'
})

/**
 * @public
 * @class UsersComponent
 * 
 * Clase para la información de los usuarios
 */
export class DetailsUsersComponent extends BaseComponent implements OnInit {
  // Lista de estados
  statesList = [];
  // Lista de roles
  roleList = [];
  // Usuario actual
  currentUser = {
    ID: null,
    email: null,
    date: null,
    role: null,
    state: null
  }
  
  /**
	 * @private
	 * @method constructor
	 */	
  constructor(
    router: Router, 
    formBuilder: FormBuilder, 
    private routerView: Router,
    private userService:UserService
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
    // Identificador del usuario
    var userId = parseInt(this.routerView.routerState.snapshot.root.queryParams.id);
    
    // Petición a base de datos
    this.userService.userDetail({id: userId}).then((resp: any) => {
      // Asignación de respuesta a usuario actual
      this.currentUser = {
        ID: userId,
        email: resp.email,
        date: new Date(resp.fecha_registro),
        role: resp.rol,
        state: resp.estado
      }
    }, (error: any) => {
      console.error("Unable to load data");
    });

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
   * @method onMaxHours 
   * Methodo para visualizar las fechas
   */  
  showDate(date: Date){
    return date ? toGTMformat(date) : "-";
  }

  /**
   * @private
   * @method showState
   * Metodo para visualizar un estado dado el identificador
   */
  showState(id: number) {
    if(this.statesList.length > 0){
      return this.statesList.filter(item => item.id == id)[0].description;
    }
  }

  /**
   * @private
   * @method showRol
   * Metodo para visualizar un rol dado el identificador
   */
  showRol(id: number) {
    if(this.roleList.length > 0){
      return this.roleList.filter(item => item.id == id)[0].description;
    }
  }


}
