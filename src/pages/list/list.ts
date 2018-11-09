import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Platform } from 'ionic-angular';
import { AlertController } from "ionic-angular";
import { NgZone } from "@angular/core";
import { Events } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { UtilityService } from '../../services/utility.service';
import { Globals } from '../../services/globals';

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string; note: string; icon: string }>;
  notifications;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public events: Events,
    private zone: NgZone,
    private globals: Globals,
    private util: UtilityService,
    private platform: Platform,
    public alertCtrl: AlertController //private backgroundMode: BackgroundMode, private webIntent: WebIntent
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get("item");

    this.notifications = this.globals.notifications;
    setInterval(() => {
      this.notifications = this.globals.notifications;
    }, 1000);

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

  pushToArrayAndStorage(array) { //Mover para um service pq tem 2
    this.globals.notifications = this.globals.notifications.concat(array);
    this.storage.set("list", this.globals.notifications);
    this.events.publish("updateScreen");
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
