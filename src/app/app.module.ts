import { FusionChartsModule } from "angular-fusioncharts";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import {
  AngularWebStorageModule,
  SessionStorageService
} from "angular-web-storage";
import { NgxLoadingModule } from "ngx-loading";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FintTheme from "fusioncharts/themes/fusioncharts.theme.fint";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { StorageServiceModule } from "angular-webstorage-service";
import { APP_INITIALIZER } from "@angular/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { UserIdleModule } from "angular-user-idle";
import { DeviceDetectorModule } from "ngx-device-detector";
import { MAT_DATE_LOCALE } from "@angular/material";
import { AppComponent } from "./app.component";
//Servicios
import { ExcelService } from "./services/excel.services";
import { LoginAuthService } from "./services/auth.services";
import { VehicleService } from "./services/vehicles.services";
import { MaintenancesService } from "./services/maintenances.services";
import { HomeService } from "./services/home.services";
//Componentes
import { TextfieldComponent } from "./components/forms/textfield/textfield.component";
import { SelectfieldComponent } from "./components/forms/selectfield/selectfield.component";
import { PasswordComponent } from "./components/forms/password/password.component";
//Vistas
import { LoginComponent } from "./views/login/login.component";
import { HomeComponent } from "./views/home/home.component";
import { VehiclesComponent } from "./views/vehicles/vehicles.component";
import { ComponentsComponent } from "./views/components/components.component";
import { MaintenanceComponent } from "./views/maintenance/maintenance.component";
import { MapComponent } from "./views/map/map.component";
import { UsersComponent } from "./views/users/users.component";
import { DetailsvehicleComponent } from "./views/detailsvehicles/detailsvehicles.component";
import { DetailsUsersComponent } from "./views/detailsusers/detailsusers.component";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule
} from "@angular/material";
import { CdkTableModule } from "@angular/cdk/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatPaginatorIntl } from "@angular/material";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);

const appRoutes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "dashboard",
    component: HomeComponent
  },
  {
    path: "vehicles",
    component: VehiclesComponent
  },
  {
    path: "components",
    component: ComponentsComponent
  },
  {
    path: "maintenance",
    component: MaintenanceComponent
  },
  {
    path: "map",
    component: MapComponent
  },
  {
    path: "users",
    component: UsersComponent
  },
  {
    path: "detailsvehicles",
    component: DetailsvehicleComponent
  },
  {
    path: "detailsusers",
    component: DetailsUsersComponent
  }
];

@NgModule({
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ]
})
export class DemoMaterialModule {}

export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = "Equipos por pagina: ";
  nextPageLabel = "Siguientes";
  previousPageLabel = "Anteriores";

  getRangeLabel = function(page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return "0 de " + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return startIndex + 1 + " - " + endIndex + " de " + length;
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VehiclesComponent,
    ComponentsComponent,
    MaintenanceComponent,
    MapComponent,
    UsersComponent,
    DetailsvehicleComponent,
    DetailsUsersComponent,
    TextfieldComponent,
    SelectfieldComponent,
    PasswordComponent,
    HomeComponent
  ],
  imports: [
    StorageServiceModule,
    NgxDatatableModule,
    NgbModule.forRoot(),
    AngularWebStorageModule,
    NgxLoadingModule.forRoot({ fullScreenBackdrop: true }),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FusionChartsModule,
    DeviceDetectorModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: true }),
    UserIdleModule.forRoot({ idle: 290, timeout: 10, ping: 120 }),
    DemoMaterialModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot()
  ],
  providers: [
    LoginAuthService,
    MaintenancesService,
    HomeService,
    VehicleService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
    ExcelService,
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" }
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
