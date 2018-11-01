import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NgZone  } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { WebIntent } from '@ionic-native/web-intent';
//import { BackgroundMode } from '@ionic-native/background-mode';

declare var notificationListener: any;
//declare var backgroundService: any;

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  notifications = ['teste2'];
  maxtime: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
              public events: Events, private zone: NgZone, public alertCtrl: AlertController, //private backgroundMode: BackgroundMode, //private webIntent: WebIntent
              ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');


    //backgroundMode.enable();
    //backgroundMode.excludeFromTaskList();
    //this.testIfBackground();


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

    setInterval(() => {
      this.startTimer(); // Now the "this" still references the component
   }, 7000);

    //this.startTimer();

    /* try {
      notificationListener.listen((n) => {
         try {
          const t = window['setConfig']();
          //this.pushToArrayAndStorage('status', t);
           //t.then((val) => {
            this.pushToArrayAndStorage('status', t);
          //});
        } catch(e) {
          this.pushToArrayAndStorage('error', e);
        }
        // if (this.filter(n.title, n.text)) {
        //  this.pushToArrayAndStorage(n.title, n.text);
        //}
      }, function(e) {
        console.log("Notification Error " + e);
      });
    } catch(e) {
      this.pushToArrayAndStorage('ERROR', 'notificationListener Undefined');
    } */

  }

  testIfBackground() {

    /* let alert = this.alertCtrl.create({
      title: 't',
      subTitle: this.notifications.length + '',
      buttons: ['Dismiss']
    });
    alert.present();*/
   /*  if ((<any>window).plugins)
    (<any>window).plugins.intentShim.getIntent((intent) => {
      if (intent) {
        let s = '';
        for (var key in intent) {
          if (intent.hasOwnProperty(key)) {
            s += intent[key];
          }
        }
        //if (s.toLowerCase().includes('meuapp')) this.backgroundMode.moveToBackground();
      } else {
        //this.pushToArrayAndStorage('debug', 'empty');
      }
    }, () => this.pushToArrayAndStorage('debug', 'intent error')); */
  }

  pushToArrayAndStorage(title, text) {
    this.notifications.push(title + ' - ' + text)
    this.storage.set('list', this.notifications);
    this.events.publish('updateScreen');
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  removeItem(event, item) {
  	  const index = this.notifications.indexOf(item, 0);
     if (index > -1) {
       this.notifications.splice(index, 1);
     }
     this.storage.set('list', this.notifications);
   }

	startTimer() {
      const t = window['setConfig']();
      t.then((val) => {
      	if (val) {
      		this.pushToArrayAndStorage('Ntfs', val);
      	}
      });
	}

  filter(title, text) {
    title = title.toUpperCase();;
    text = text.toUpperCase();
    //if (title.includes('28824') || title.includes('NUBANK') || title.includes('CARTÕES')) {
      if (text.includes('COMPRA')) {
        return true;
      }
    //}
    return false;
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Novo',
      inputs: [
        {
          name: 'value'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Adicionar',
          handler: data => {
            this.pushToArrayAndStorage('Adicionado Manulamente - R$ ', data.value);
          }
        }
      ]
    });
    alert.present();
  }

}
