import { Component, OnInit, HostListener } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
declare var $
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@HostListener('window:resize', ['$event'])
export class AppComponent implements OnInit {
  title = 'covid-gabon';
  shouldRun
  constructor() {
  
  }
  ngOnInit() {
   // console.log('$.fakeLoader', $.fakeLoader)
    var fk =  $.fakeLoader({
        spinner: 'spinner1',
        bgColor: 'rgb(25, 9, 255)'
      })
      if(window.innerHeight > window.innerWidth){
         $('.popup').css({'display':'block', 'bottom': 0, 'top': 0, 'left': 0, 'right': 0, 'height': window.innerHeight + 'px'})
         $("body, html").css("overflow", "hidden")
    }
    
  }
  slide() {
    $('.ui.sidebar')
    .sidebar('toggle')
  }
  onResize(event) {
    $('.col-edit').css('height', window.innerHeight - $('mat-toolbar').height() + 'px')
    event.target.innerWidth;
    if(window.innerHeight > window.innerWidth){
     // console.log("Please use Landscape!");
      $("body, html").css("overflow", "hidden")
      $('.popup').css({'display':'block', 'bottom': 0, 'top': 0, 'left': 0, 'right': 0, 'height': window.innerHeight + 'px'})
  } else {
    $('.popup').css('display', 'none')
    $("body, html").css("overflow", "auto")
  }
  $('.col-edit').css('height', window.innerHeight - ($('mat-toolbar').height()+ $('.mat-tab-label-container').height() + $('footer').height()) + 'px')
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
  $('.col-edit').css('height', window.innerHeight - ($('mat-toolbar').height()+ $('.mat-tab-label-container').height() + $('footer').height()) + 'px')
    //console.log('taille ', window.innerHeight - $('mat-toolbar').height())
  }
  slideer(id) {
    $('#'+id).click()
  }
}
