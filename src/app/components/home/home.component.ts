// import { Component } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Servicios
import { ApiGetDatosEmpleadoByClaveService } from 'src/app/servicios/api-get-datos-empleado-by-clave.service';
import { ApiGetDatosFotografiaBaseService } from 'src/app/servicios/api-get-datos-fotografia-base.service';
import { ApiUploadImageService } from 'src/app/servicios/api-upload-image.service';
import { ApiCompareImageService } from 'src/app/servicios/api-compare-image.service';
import { ApiEliminarImagenService } from 'src/app/servicios/api-eliminar-imagen.service';
import { ApiRegistrarAccesoService } from 'src/app/servicios/api-registrar-acceso.service';

//interfaces
import { Empleado } from 'src/app/interfaces/empleado.model';

// Alertas
import { MatSnackBar } from '@angular/material/snack-bar';

//Otros componentes
import { AvisoPrivacidadComponent } from '../avisoPrivacidad/aviso-privacidad/aviso-privacidad.component';


// Declara la variable global 'bootstrap' para que TypeScript la reconozca
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit{
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  form: FormGroup;
  empleado: Empleado | null = null; // Declara la variable para almacenar los datos del empleado
  fotoUrl: string | null = null; // Variable para almacenar la URL de la foto
  isLoading = false; // Propiedad para controlar el estado de carga
  diaSemanaEnEspanol: string = "";

  


  constructor(
    private fb: FormBuilder,
    private apiService: ApiGetDatosEmpleadoByClaveService,
    private fotoService: ApiGetDatosFotografiaBaseService,
    private uploadImageService: ApiUploadImageService,
    private compareImageService: ApiCompareImageService,
    private eliminarImagenService: ApiEliminarImagenService,
    private registrarAccesoService: ApiRegistrarAccesoService,
    private snackBar: MatSnackBar,
    // public dialog: MatDialog



  ) {
    this.form = this.fb.group({
      employeeNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      // employeeNSS: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });




  }

  private showLoading() {
    this.isLoading = true;
  }

  private hideLoading() {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.startCamera();




  }

  obtenerDiaSemanaEnEspanol(fecha: Date): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaSemana = fecha.getDay(); // Obtiene el día de la semana (0-6)
    return diasSemana[diaSemana]; // Retorna el nombre del día en español
  }


  openAvisoPrivacidad() {
    console.log("okModal");

    const modalElement = document.getElementById('avisoPrivacidadModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }



  startCamera(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
      }).catch(error => {
        console.error('Error accessing camera: ', error);
        this.snackBar.open('!Error al Acceder a la Cámara', 'Cerrar', {
          duration: 6000,
          panelClass: ['mat-warn']
        });
      });
    } else {
      this.snackBar.open('!HOfficeAdmin no es compatible con tu navegador, consulta al administrador!', 'Cerrar', {
        duration: 6000,
        panelClass: ['mat-warn']
      });
    }
  }
  

  async captureImage(): Promise<void> {
    if (this.form.valid) {
      this.showLoading(); // Muestra el indicador de carga

      try {
        const employeeNumber = this.form.get('employeeNumber')?.value;
        await this.getEmployeeData(employeeNumber);

        if (this.empleado != null) {
          console.log('RFC:', this.empleado.rfc);
          await this.getFotoUrl(this.empleado.rfc);

          var originalPath = "";
          if (this.fotoUrl) {
            console.log('URL de la imagen Original:', this.fotoUrl);
            originalPath = this.fotoUrl;
          }

          const decodedPath = await this.captureAndUploadImage();
          console.log('Imagen a comparar:', decodedPath);

          const similarity = await this.compare(originalPath, decodedPath);

          if (similarity > 0) {
            console.log("Registrar");
            const response = await this.regitrarAcceso(employeeNumber, decodedPath);

            if (response) {
              this.snackBar.open('¡Acceso Correcto!', 'Cerrar', {
                duration: 3000,
                panelClass: ['mat-success'],
              });
            } else {
              this.snackBar.open('¡Error al registrar el acceso, consulta a con tu responsable de administración!', 'Cerrar', {
                duration: 6000,
                panelClass: ['mat-warn']
              });
            }
          } else {
            console.log("Elimina la imagen que se cargó");
            const deleteSuccess = await this.eliminarImagen(decodedPath);
            console.log('Imagen eliminada:', deleteSuccess);
            if(deleteSuccess){
              this.snackBar.open('¡La información que ingresaste no es compatible!', 'Cerrar', {
                duration: 3000,
                panelClass: ['mat-warn']
              });
            }
          }
        } else {
          this.snackBar.open('¡No se pudieron obtener los datos del empleado!', 'Cerrar', {
            duration: 3000,
            panelClass: ['mat-warn']
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.snackBar.open('¡Ocurrió un error inesperado!', 'Cerrar', {
          duration: 3000,
          panelClass: ['mat-warn']
        });
      } finally {
        this.hideLoading(); // Oculta el indicador de carga
      }
    } else {
      this.snackBar.open('¡Por favor ingrese los datos solicitados!', 'Cerrar', {
        duration: 3000,
        panelClass: ['mat-warn']
      });
    }
  }

  getEmployeeData(employeeNumber: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getDataEmpleado(employeeNumber).subscribe(
        (data: Empleado[]) => {
          if (data.length > 0) {
            this.empleado = data[0]; // Accede al primer elemento del array
            console.log('Datos del empleado:', this.empleado);
          } else {
            this.empleado = null;
          }
          resolve();
        },
        (error: any) => {
          console.error('Error al obtener los datos del empleado:', error);
          reject(error);
        }
      );
    });
  }



  compare(OriginalPathImage: string, ComparePathImage: string): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        const response = await this.compareImageService.compareImages(OriginalPathImage, ComparePathImage).toPromise();
        console.log('Respuesta de comparación:', response);
        resolve(response); // La respuesta es directamente el número entre 0 y 100
      } catch (error) {
        console.error('Error al comparar las imágenes', error);
        resolve(0);
      }
    });
  }
  
  

  async captureAndUploadImage(): Promise<string> {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);

    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/png');
    });

    if (blob && this.empleado) {
      const formData = new FormData();
      formData.append('imagen', blob, 'capture.png');
      formData.append('claveEmpleado', this.empleado.claveEmpleado);

      return new Promise<string>((resolve, reject) => {
        this.uploadImageService.uploadImage(formData).subscribe(
          response => {
            if (response.success) {
              const decodedPath = atob(response.path);
              // console.log('Imagen subida con éxito', response);
              resolve(decodedPath);
            } else {
              console.error('Error en la respuesta de la API', response);
              reject('Error en la respuesta de la API');
            }
          },
          error => {
            console.error('Error al subir la imagen', error);
            reject(error);
          }
        );
      });
    } else {
      return Promise.reject('No se pudo capturar la imagen o no se encontró el empleado');
    }
  }


  getFotoUrl(rfc: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fotoService.getPathImage(rfc).subscribe(
        (response: { message: string }) => {
          this.fotoUrl = response.message;
          resolve();
        },
        (error: any) => {
          console.error('Error al obtener la URL de la foto:', error);
          reject(error);
        }
      );
    });
  }

  eliminarImagen(path: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

      this.eliminarImagenService.eliminarImagen(path).subscribe(
        response => {
          console.log('Respuesta de eliminación:', response);
          resolve(true); // Asume que la respuesta es exitosa si no hay error
        },
        error => {
          console.error('Error al eliminar la imagen', error);
          resolve(false); // Devuelve false en caso de error
        }
      );
    });
  }

  regitrarAcceso(claveEmpleado: string, pathImagen: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        // Obtener el nombre del archivo sin la extensión
        const fileNameWithExtension = pathImagen.split('\\').pop(); // Obtener la última parte de la ruta
        const fileNameWithoutExtension = fileNameWithExtension?.split('.').shift(); // Eliminar la extensión
  
        if (fileNameWithoutExtension) {
          // Convertir el nombre del archivo al formato de hora
          const formattedTime = fileNameWithoutExtension.replace(/_/g, ':');
  
          // Obtener la fecha de hoy en formato local
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
          const day = String(today.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`; // yyyy-mm-dd
          const formattedDateTime = `${formattedDate} ${formattedTime}.000`;
  
          console.log(`Clave Empleado: ${claveEmpleado}, Hora: ${formattedDateTime}`);

          const hoy = new Date();
          this.diaSemanaEnEspanol = this.obtenerDiaSemanaEnEspanol(hoy);
          console.log(this.diaSemanaEnEspanol); // Imprime el día de la semana en español
          
          // Crear FormData y llamar al servicio para registrar el acceso
          this.registrarAccesoService.registrarAcceso(claveEmpleado, formattedDateTime, this.diaSemanaEnEspanol).subscribe(
            response => {
              if (response) {
                resolve(true);
              } else {
                resolve(false);
              }
            },
            error => {
              resolve(false);
            }
          );
        } else {
          throw new Error('No se pudo obtener el nombre del archivo.');
        }
      } catch (error) {
        console.error('Error en regitrarAcceso:', error);
        resolve(false);
      }
    });
  }
  
  
  

}
