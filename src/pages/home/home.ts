import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgZone  } from '@angular/core';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { chart } from 'highcharts';
import * as Highcharts from 'highcharts';
import { Globals } from '../../services/globals';

//declare var notificationListener: any;

const High = Highcharts;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('chartTarget') chartTarget: ElementRef;
  chart: Highcharts.Chart;

  constructor(public navCtrl: NavController, private globals: Globals, public storage: Storage,
              public events: Events, private zone: NgZone, public alertCtrl: AlertController) {

    //console.log(globals.notifications);
  }

  clearStorage() {
  /*if (this.notifications.length > 0) {
      this.storage.remove('title');
      this.notifications = [];
    }*/
  }

  ionViewDidLoad() {
    var myChart = High.chart('container', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Fruit Consumption'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      }
    });

  }

}
