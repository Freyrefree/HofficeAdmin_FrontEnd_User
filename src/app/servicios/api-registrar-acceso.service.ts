import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRegistrarAccesoService {

  // private apiUrl = 'http://tu-servidor/api/RegistrarAcceso'; // URL actualizada de la API
  // private apiUrl = 'http://192.168.1.14:8102/api/RegistrarAcceso';
  private apiUrl = 'https://g-mc.mx:8102/api/RegistrarAcceso';
  // private apiUrl = 'https://localhost:44306/api/RegistrarAcceso';



  constructor(private httpClient: HttpClient) { }

  registrarAcceso(claveEmpleado: string, formattedDateTime: string, dia: string): Observable<any> {
    const formData = new FormData();
    formData.append('ClaveEmpleado', claveEmpleado);
    formData.append('FechaHora', formattedDateTime); // Suponiendo que el campo en la API se llama 'hora'
    formData.append('Tipo', '1');
    formData.append('Descripcion', 'Acceso');
    formData.append('Dia', dia);


    return this.httpClient.post(this.apiUrl, formData);
  }
}
