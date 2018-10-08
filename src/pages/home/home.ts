import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgZone  } from '@angular/core';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var notificationListener: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  notifications = [];

  constructor(public navCtrl: NavController, public storage: Storage, public events: Events, private zone: NgZone, private alertCtrl: AlertController) {

    this.events.subscribe('updateScreen', () => {
      this.zone.run(() => {
        console.log('force update the screen');

        this.storage.get('title').then((val) => {
          this.notifications = val;
        });
      });
    });

    /*if (this.notifications.length > 0) {
      this.storage.remove('title');
      this.notifications = [];
    }*/

    notificationListener.listen((n) => {
      if (n.text.toUpperCase().indexOf('COMPRA') >= 0) {
        this.notifications.push(n.title + '-' + n.text);
        storage.set('title', this.notifications);
      }

      events.publish('updateScreen');
      //console.log("Received notification " + JSON.stringify(n));
    }, function(e) {
      //console.log("Notification Error " + e);
    });

  }

  getKeys(map) {
    /*let alert = this.alertCtrl.create({
      title: 'a',
      subTitle: 'b',
      buttons: ['Dismiss']
    });
    this.storage.get('title').then((val) => {
      this.notifications.push('17');
    });*/
    return this.notifications;
  }

}
