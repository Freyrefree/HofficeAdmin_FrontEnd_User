import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule


//Rutas
import { APP_ROUTING } from './app.routes';
//Servicios

//Componenetes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AvisoPrivacidadComponent } from './components/avisoPrivacidad/aviso-privacidad/aviso-privacidad.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AvisoPrivacidadComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, // Agrega FormsModule aquí
    ReactiveFormsModule, // Agrega ReactiveFormsModule a los imports,
    MatSnackBarModule,
    APP_ROUTING,
    BrowserAnimationsModule
  ],
  providers: [

    

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
