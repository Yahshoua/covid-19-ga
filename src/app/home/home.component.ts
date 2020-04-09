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
 day = moment().format('DD MMMM Y')
 total: any;
 Gabon
 last6day
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
       // console.log('data => ', res, 'date=> ', date,'moment => ', mydate, 'dateP ', moment(date).format('DD MM Y'))
        fetch(api1, {method: 'GET', redirect: 'follow'})
        .then(response => response.json())
        .then(data=> {
            data["Gabon"].forEach( function(e) {
                e.date = moment(e.date).format('DD-MM-Y')
               // e.actif = e.confirmed - (e.deaths + e.recovered)
            }) 
            var tabGabon = data["Gabon"]
            var day = moment().format('DD-MM-Y')
            var addObj = {
                date: moment(date).format('DD-MM-Y'),
                confirmed: parseInt(this.data.active_cases),
                recovered: parseInt(this.data.total_recovered),
                deaths: parseInt(this.data.total_deaths),
                pending: false
                //actif: parseInt(this.data.active_cases)
            }
            if(day !== moment(date).format('DD-MM-Y')) {
                addObj.pending = true
            }
            tabGabon.push(addObj)
            this.Gabon = tabGabon
            var e = this.Gabon.length - 6
            var k = this.Gabon.filter((k, j)=> {
                    return j >= e
                })
                k.forEach((element, i) => {
                    element.id = i
                });
            this.last6day = k.sort((a, b)=> {
                if (a.id < b.id ) {
                return 1;
              }
              if (a.id > b.id ) {
                return -1;
              }
              return 0;
          })
          //  console.log('last6 ', this.last6day)
            this.ready()
            $('.fakeLoader').hide()
        })
    
    this.maj = mydate
    this.total =parseInt(this.data.active_cases) + parseInt(this.data.total_deaths) + parseInt(this.data.total_recovered)
    //console.log('total=> ', this.total, ' actifs ', this.data.active_cases)
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
        Chart.defaults.global.animationEasing = "easeOutBounce";
        var ctx3 = document.getElementById('morts')
        //var ctx4 = document.getElementById('jr-evolution')
        new Chart(ctx, {
          type: 'pie',
          options: {
            responsive: true
          },
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
     // console.log('Gabon ', this.Gabon)
      var lines = this.Gabon.map(e=> {
        return e.date
    })
      var lineChartData = {
        labels: lines,
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
      new Chart.Line(ctx2, {
        data: lineChartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            onResize: (e, dim)=> {
                //console.log('e ', e ,'dim  ', dim)
               //e.height = '200'
              
            }
          }
    });
    var tab = []
    for(var i=1;i< 29;i++) {
        tab.push(i)
    }
    var e = this.Gabon.length - 28
    var p = this.Gabon.filter((k, j)=> {
        return j >= e
    })
            var lineChartData2 = {
                labels:  p.map(i=> {
                    return i.date
                }),
                datasets: [
                    {
                        label: 'Decès',
                        borderColor: 'rgb(255, 0, 54)',
                        backgroundColor: 'rgb(255, 0, 54)',
                        fill: '1',
                        lineTension:  0.4,
                        //showLine: false,
                        data: p.map(i=> {
                            return i.deaths
                        })
                    }
            ]
            };
    var mort2 = document.getElementById('morts2')
    new Chart.Line(mort2, {
        data: lineChartData2,
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 1
                    }
                }]
            }
        }
    });
    var chart = new Chart.Line(ctx3, {
        data: lineChartData2,
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 1
                    }
                }]
            }
        }
    });
    //
    var data = {
        labels: this.Gabon.map(e=> {
            return e.date
        }),
        datasets: lineChartData.datasets
      };
      var options = {
        maintainAspectRatio: true,
        scales: {
        //   yAxes: [{
        //     stacked: true,
        //     gridLines: {
        //       display: true,
        //       color: "rgba(255,99,132,0.2)"
        //     }
        //   }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        }
      };
      var cht = document.getElementById('chart')
      Chart.Bar(cht, {
        options: options,
        data: data
      });
    //
    var tab = []
    for(var i=1;i< 29;i++) {
        tab.push(i)
    }
    var e = this.Gabon.length - 28
    var p = this.Gabon.filter((k, j)=> {
        return j >= e
    })
    var lineChartData3 = {
        labels: p.map(e=> {
            return e.date
        }),
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
                data: p.map(e=> {
                    return e.confirmed
                })
            }
    ]
    };
    var ev = document.getElementById('jr-evolution2')
    new Chart.Bar(ev, {
        data: lineChartData3,
        options: {
            responsive: true
          }
    });
                // new Chart(ctx4, {
                //     type: 'line',
                //     data: lineChartData3,
                //     options: {
                //         responsive: true
                //       }
                // });
      $('.col-rate-mort').css('height', $('.col-graph-circle').height() +'px')
      // console.log('height ', $('.col-graph-circle').height())
      }
}
