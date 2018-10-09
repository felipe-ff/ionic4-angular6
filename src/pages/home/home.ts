import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgZone  } from '@angular/core';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Autostart } from '@ionic-native/autostart';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

declare var notificationListener: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  notifications = [];
  debugMsg: string[] = [];

  constructor(public navCtrl: NavController, public storage: Storage, public events: Events, private zone: NgZone, private autostart: Autostart,
              private push: Push) {

    this.autostart.enable();

    // to check if we have permission
    this.push.hasPermission()
    .then((res: any) => {
      if (res.isEnabled) {
        console.log('We have permission to send push notifications');
        this.debugMsg.push('We have permission to send push notifications');
      } else {
        console.log('We do not have permission to send push notifications');
        this.debugMsg.push('We do NOT have permission to send push notifications');
      }
    });

    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    this.push.createChannel({
    id: "testchannel1",
    description: "My first test channel",
    // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
    importance: 3
    }).then(() => this.debugMsg.push('Channel created'));

    // Delete a channel (Android O and above)
    //this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

    // Return a list of currently configured channels
    this.push.listChannels().then((channels) => this.debugMsg.push('List of channels: ' + channels))

    // to initialize push notifications

    const options: PushOptions = {
      android: {},
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => this.debugMsg.push('Received a notification: ' + notification));

    this.storage.get('title').then((val) => {
      this.notifications = val;
    });

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
