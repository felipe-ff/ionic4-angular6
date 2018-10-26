import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { AlertController } from 'ionic-angular';
import { NgZone  } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var notificationListener: any;

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  notifications = ['teste'];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
              public events: Events, private zone: NgZone, //public alertCtrl: AlertController
              ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.storage.get('list').then((val) => {
      if (val && val.length > 0) this.notifications = val;
    });

    this.events.subscribe('updateScreen', () => {
      this.zone.run(() => {
        console.log('force update the screen');
        this.storage.get('list').then((val) => {
          this.notifications= val;
        });
      });
    });

    try {
      notificationListener.listen((n) => {
        if (n.text.toUpperCase().indexOf('COMPRA') >= 0) {
          this.notifications.push(n.title + ' - ' + n.text);
          storage.set('list', this.notifications);
          events.publish('updateScreen');
        }
      }, function(e) {
        console.log("Notification Error " + e);
      });
    } catch(e) {
      console.log('notificationListener und');
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  removeItem(event, item) {
    console.log(item);
    const index = this.notifications.indexOf(item, 0);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }

    this.storage.set('list', this.notifications);
  }
}
