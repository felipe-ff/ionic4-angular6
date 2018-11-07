import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Platform } from 'ionic-angular';
import { AlertController } from "ionic-angular";
import { NgZone } from "@angular/core";
import { Events } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string; note: string; icon: string }>;
  notifications = ["teste2"];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public events: Events,
    private zone: NgZone,
    private util: UtilityService,
    private platform: Platform,
    public alertCtrl: AlertController //private backgroundMode: BackgroundMode, private webIntent: WebIntent
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get("item");

    this.storage.get("list").then(val => {
      if (val && val.length > 0) {
          this.notifications = val;
      }
    });

    this.events.subscribe("updateScreen", () => {
      this.zone.run(() => {
        console.log("force update the screen");
        this.storage.get("list").then(val => {
          this.notifications = val;
        });
      });
    });

    setInterval(() => {
      this.readFromBGSPlugin(); // Now the "this" still references the component
    }, 3000);
  }

  readFromBGSPlugin() {
    try {
      if ( !(this.platform.is('mobileweb') || this.platform.is('core')) )  {
        const promise = this.util.setConfig(false);
        promise.then(val => {
          const newVal = val.toString();
          if (newVal) {
            const values = newVal.toString().split('%-%');
            const nonEmptyValues = values.filter(function(e) { return e; }); //remove valores vazios do array
            this.pushToArrayAndStorage(nonEmptyValues);
            this.util.setConfig(true);
          }
        });
      }
    } catch(e) {
      this.showAlert(e);
    }
  }

  pushToArrayAndStorage(array) {
    this.notifications = this.notifications.concat(array);
    this.storage.set("list", this.notifications);
    this.events.publish("updateScreen");
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
      this.storage.set("list", this.notifications);
    }
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: "Novo",
      inputs: [
        {
          name: "value"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Adicionar",
          handler: data => {
            this.pushToArrayAndStorage(
              "Adicionado Manulamente - R$ " + data.value
            );
          }
        }
      ]
    });
    alert.present();
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Teste!',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
