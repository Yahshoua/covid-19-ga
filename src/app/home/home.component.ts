import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js'
declare var $, moment
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 data
 maj
 total: any;
 Gabon
 percent = {
     actif: undefined,
     morts: undefined,
     retablis: undefined
 }
    
  constructor() { }

  ngOnInit() {
    moment().locale('fr')
    var raw = "";
    var api1 = "https://pomber.github.io/covid19/timeseries.json"
    var api2 = "https://corona-virus-stats.herokuapp.com/api/v1/cases/countries-search?search=Gabon"
    fetch(api2, {method: 'GET', redirect: 'follow'})
    .then(response => response.json())
    .then(res => {
        this.data = res.data.rows[0]
        var date = res.data.last_update.replace(', UTC','')
        var mydate =  moment(date).format("DD MMMM Y")
        console.log('data => ', res, 'date=> ', date,'moment => ', mydate, 'dateP ', moment(date).format('DD MM Y'))
        fetch(api1, {method: 'GET', redirect: 'follow'})
        .then(response => response.json())
        .then(data=> {
            data["Gabon"].forEach( function(e) {
                e.date = moment(e.date).format('DD-MM-Y')
               // e.actif = e.confirmed - (e.deaths + e.recovered)
            }) 
            var tabGabon = data["Gabon"]
            tabGabon.push({
                date: moment(date).format('DD-MM-Y'),
                confirmed: parseInt(this.data.active_cases),
                recovered: parseInt(this.data.total_recovered),
                deaths: parseInt(this.data.total_deaths),
                //actif: parseInt(this.data.active_cases)
            })
            this.Gabon = tabGabon
            var dates = this.Gabon.map(e=> {
                return e.date
            })
            console.log('Gabon ', this.Gabon)
            this.ready()
        })
    
    this.maj = mydate
    this.total =parseInt(this.data.active_cases) + parseInt(this.data.total_deaths) + parseInt(this.data.total_recovered)
    console.log('total=> ', this.total, ' actifs ', this.data.active_cases)
    this.percent = {
    actif: Math.floor(parseInt(this.data.active_cases)*100/this.total),
     morts: Math.floor(parseInt(this.data.total_deaths)*100/this.total),
     retablis: Math.floor(parseInt(this.data.total_recovered)*100/this.total)
    }
    
    
    });
    var data = {
      datasets: [{
          data: [10, 20, 30]
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Red',
          'Yellow',
          'Blue'
      ]
  };
  }
      ngAfterViewChecked(): void {
        
      }
      ready() {
        var ctx = document.getElementById('circle')
        var ctx2 = document.getElementById('evolution')
        var ctx3 = document.getElementById('morts')
        var ctx4 = document.getElementById('jr-evolution')
        new Chart(ctx, {
          type: 'pie',
          data: {
              labels: ['Cas actifs', 'Morts', 'Retablis'],
              datasets: [{
                  label: '# of Votes',
                  data: [this.data.active_cases, this.data.total_deaths, this.data.total_recovered],
                  backgroundColor: [
                      'rgb(156, 39, 176)',
                      'rgb(255, 0, 54)',
                      'rgb(4, 255, 87)'
                  ],
                  borderColor: [
                      'rgb(156, 39, 176)',
                      'rgb(255, 0, 54)',
                      'rgb(4, 255, 87)'
                  ],
                  borderWidth: 0
              }]
          }
      });
      var lineChartData = {
        labels: this.Gabon.map(e=> {
            return e.date
        }),
        datasets: [
            {
                label: 'Cas confirmés',
                borderColor: 'rgb(255, 152, 0)',
                backgroundColor: 'rgb(255, 152, 0)',
                fill: false,
                borderWidth: 1,
                lineTension:  0.000001,
                data: this.Gabon.map(e=> {
                    return e.confirmed
                })
            },
        //     {
        //     label: 'Cas actifs',
        //     borderColor: 'rgb(156, 39, 176)',
        //     backgroundColor: 'rgb(156, 39, 176)',
        //     fill: false,
        //     data: [
        //         '0', '30', '54','15','40','95','120'
        //     ]
        // }, 
        {
            label: 'Decès',
            borderColor: 'rgb(255, 0, 54)',
            backgroundColor: 'rgb(255, 0, 54)',
            fill: false,
            borderWidth: 1,
            lineTension:  0.000001,
            data:this.Gabon.map(e=> {
                return e.deaths
            })
        },
        {
            label: 'Retablis',
            borderColor: 'rgb(4, 255, 87)',
            backgroundColor: 'rgb(4, 255, 87)',
            fill: false,
            borderWidth: 1,
            lineTension:  0.000001,
            data:this.Gabon.map(e=> {
                return e.recovered
            })
        }
    ]
    };
      new Chart(ctx2, {
        type: 'line',
        data: lineChartData,
        options: {
            scales: {
                yAxes: [{
                    stacked: false
                }]
            }
        }
    });
            var lineChartData2 = {
                labels: this.Gabon.map(e=> {
                    return e.date
                }),
                datasets: [
                    {
                        label: 'Decès',
                        borderColor: 'rgb(255, 0, 54)',
                        backgroundColor: 'rgb(255, 0, 54)',
                        fill: '1',
                        spanGaps: true,
                        steppedLine: 'after',
                        lineTension:  0.000001,
                        //showLine: false,
                        data: [
                            '0', '50', '30','70','100','20','200'
                        ]
                    }
            ]
            };
    
    var chart = new Chart.Line(ctx3, {
        data: lineChartData2,
        options: {
            plugins: {
                filler: {
                    propagate: true
                }
            }
        }
    });
    var tab = []
    for(var i=0;i< 29;i++) {
        tab.push(i)
    }
    var lineChartData3 = {
        labels: tab,
        datasets: [
            {
                label: 'Nouveaux cas',
                borderColor: 'rgb(255, 152, 0)',
                backgroundColor: 'rgb(255, 152, 0)',
                fill: '1',
                spanGaps: true,
                //steppedLine: 'after',
                lineTension:  0.000001,
                //showLine: false,
                data: [
                    '0', '50', '30','70','100','20','200','0', '50', '30','70','100','20','200','0', '50', '30','70','100','20','200','0', '50', '30','70','100','20','200',"10"
                ]
            }
    ]
    };
                new Chart(ctx4, {
                    type: 'line',
                    data: lineChartData3
                });
      $('.col-rate-mort').css('height', $('.col-graph-circle').height() +'px')
      console.log('height ', $('.col-graph-circle').height())
      }
}
