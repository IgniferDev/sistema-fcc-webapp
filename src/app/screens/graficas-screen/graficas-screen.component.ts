import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Observable } from 'rxjs';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  //Agregar chartjs-plugin-datalabels
  //Variables
  
  public total_user: any = {};
  public diasDomingo: number=0;
  public diasLunes: number=0;
  public diasMartes: number=0;
  public diasMiercoles: number=0;
  public diasJueves: number=0;
  public diasViernes: number=0;
  public diasSabado: number=0;
  public numeroAux: Number=0;
 // public numeroDomingo: Observable<number>;
  //Histograma
  lineChartData :any;
  lineChartOption = {responsive:false }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData = {
    labels: ["Desarrollo Web", "Minería de Datos", "Redes", "Móviles", "Matemáticas"],
    datasets: [
      {
        data:[34, 43, 54, 28, 74],
        label: 'Registro de materias',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];

  //Circular
  //Circular
  pieChartData :any;
  pieChartOption = {responsive:false  }
  pieChartPlugins = [ DatalabelsPlugin ];

  // Doughnut
  doughnutChartData :any;
  doughnutChartOption = {responsive:false  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private materiasService: MateriasService,
  ){}

  async ngOnInit(): Promise<void> {
    this.obtenerTotalUsers();
    //console.log("total users fuera de funcion: ", this.total_user);
    this.obtenerDomingo();
    
  }

  public obtenerDomingo(): any {
    this.materiasService.countDomingo().subscribe(
      (response) => {
        console.log("DENTRO DE FUNCION DOMINGO ES: ", response);
        console.log("el response es: ",response.num_materias_domingo);
        
        this.lineChartData = {
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [
            {
              data:[response.domingo,response.lunes ,response.martes,response.miercoles,response.jueves,response.viernes,response.sabado],
              label: 'Registro de materias',
              backgroundColor: '#F88406'
            }
          ]
        }
    

      },
      (error) => {
        console.error('Error al obtener el número de materias que se imparten en Domingo:', error);
      }
    );
  }
  


  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.doughnutChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [
            {
              data:[response.admins, response.maestros, response.alumnos],
              label: 'Registro de usuarios',
              
              backgroundColor: [
                '#F88406',
                '#FCFF44',
                '#31E7E7'
              ]
            }
          ]
        };
        this.pieChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [
            {
              data:[response.admins, response.maestros, response.alumnos],
              label: 'Registro de usuarios',
              backgroundColor: [
                '#FCFF44',
                '#F1C8F2',
                '#31E731'
              ]
            }
          ]
        }

        //this.total_user = response;
        console.log("Total usuarios: ", this.total_user);
      }, (error)=>{
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }
}
