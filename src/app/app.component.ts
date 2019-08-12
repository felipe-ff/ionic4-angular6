import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { HomePage } from "../pages/home/home";
import { ListPage } from "../pages/list/list";

import { AlertController } from "ionic-angular";
import { NgZone } from "@angular/core";
import { Events } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { UtilityService } from "../services/utility.service";
import { Globals } from "../services/globals";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { id: string; name: string; }

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string; component: any }>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public events: Events,
    private zone: NgZone,
    public storage: Storage,
    private util: UtilityService,
    private globals: Globals,
    public db: AngularFirestore
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Home", component: HomePage },
      { title: "List", component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //console.log(window['plugins']);

      this.itemsCollection = this.db.collection<Item>('items');
      this.items = this.itemsCollection.valueChanges();
      this.itemsCollection.add({id : 'd', name: 'e'});
      //this.items = this.db.collection('users').valueChanges();

      //TESTANDO NOVO COMMIT
      this.items.forEach( s => {
        console.log(s);
      });

      try {
        if (!(this.platform.is("mobileweb") || this.platform.is("core"))) {
          this.util.initialize();
          this.util.go();
        }
      } catch (e) {
        this.showAlert(e);
      }

      this.ini();

      /* Okay, so the platform is ready and our plugins are available.
       Here you can do any higher level native things you might need.
      this.statusBar.show(); */
      this.splashScreen.hide();
    });
  }

  ini() {
    this.storage.get("list").then(val => {
      if (val && val.length > 0) {
        this.globals.notifications = val;
      }
    });

    this.events.subscribe("updateScreen", () => {
      this.zone.run(() => {
        console.log("force update the screen");
        this.storage.get("list").then(val => {
          this.globals.notifications = val;
        });
      });
    });

    setInterval(() => {
      this.readFromBGSPlugin(); // Now the "this" still references the component
    }, 3000);
  }

  readFromBGSPlugin() {
    try {
      if (!(this.platform.is("mobileweb") || this.platform.is("core"))) {
        const promise = this.util.setConfig(false);
        promise.then(val => {
          const newVal = val.toString();
          if (newVal) {
            const values = newVal.toString().split("%-%");
            const nonEmptyValues = values.filter(function(e) {
              return e;
            }); //remove valores vazios do array
            this.pushToArrayAndStorage(nonEmptyValues);
            this.util.setConfig(true);
          }
        });
      }
    } catch (e) {
      this.showAlert(e);
    }
  }

  pushToArrayAndStorage(array) { //Mover para um service pq tem 2 (não mover pq o outro vai ser diferente)
    array.forEach(s => {
      let finalPrice;
      try {
        let price = s.split('R$')[1].substring(0,8);
        if (price.includes(',')) {
          let price1 = price.split(',')[0].replace( '/^\D+/g', '');
          let price2 = price.split(',')[1].replace( '/^\D+/g', '');
          finalPrice = price1 + ',' +price2;
        } else {
          finalPrice = price.replace( '/^\D+/g', '');
        }
      } catch (e) {
        console.log(e);
      }
      if (finalPrice) {
        const obj = {value: finalPrice, category: 'other', msg: s};
        this.globals.notifications.push(obj);
      }
    });
    //this.globals.notifications = this.globals.notifications.concat(array);
    this.storage.set("list", this.globals.notifications);
    this.events.publish("updateScreen");
  }

  findBGSPluginStatus() {
    /*  const status = window['getStatus']();
    status.then((val) => {
      window['setConfig']();
    }); */
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "error!",
      subTitle: msg,
      buttons: ["Dismiss"]
    });
    alert.present();
  }
}
