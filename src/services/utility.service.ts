import { Injectable } from "@angular/core";
//import { DatePipe } from '@angular/common';

declare var backgroundService: any;
//declare let cordova: any;

@Injectable()
export class UtilityService {
  myService = "";
  serviceRunning = "";
  resultNotifications = "";

  constructor() {}

  initialize() {
    var serviceName = "io.ionic.starter.MyService";
    //var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');
    this.myService = backgroundService.create(serviceName);
  }

  handleSuccess(data) {
    this.resultNotifications = data.Configuration.HelloTo;
    alert("TESTE :" + this.resultNotifications);
  }

  getStoredNotifications() {
    return this.resultNotifications;
  }

  handleError(data) {
    alert("Error: " + data.ErrorMessage);
    alert(JSON.stringify(data));
    //this.updateView(data);
  }

  getStatus() {
    return new Promise((resolve, reject) => {
      function displayResult(data) {
        console.log(data);
        alert(data);
        resolve(data.ServiceRunning);
      }
      this.myService["getStatus"](
        s => {
          displayResult(s);
        },
        e => {
          this.displayError(e);
        }
      );
    });
  }

  setConfig(reset) {
    var config = {};
    if (reset) {
      config = { HelloTo: "" };
    }
    return new Promise((resolve, reject) => {
      function displayResult(data) {
        console.log(data);
        //alert("TESTE :" + data.Configuration.HelloTo);
        resolve(data.Configuration.HelloTo);
      }
      this.myService["setConfiguration"](
        config,
        s => {
          displayResult(s);
        },
        e => {
          this.displayError(e);
        }
      );
    });
  }

  displayError(data) {
    let s = "";
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        s += data[key] + " - ";
      }
    }
    alert("We have an error: " + s);
  }

  updateHandler(data) {
    console.log(data);
    if (data.LatestResult != null) {
      try {
        console.log(data.LatestResult.Message);
      } catch (err) {}
    }
  }

  go() {
    this.myService["getStatus"](
      s => {
        this.startService(s);
      },
      e => {
        this.displayError(e);
      }
    );
  }

  startService(data) {
    if (data.ServiceRunning) {
      //setConfig(); //inseri manual
      this.enableTimer(data);
    } else {
      this.myService["startService"](
        s => {
          this.enableTimer(s);
        },
        e => {
          this.displayError(e);
        }
      );
    }
  }

  enableTimer(data) {
    if (data.TimerEnabled) {
      this.registerForUpdates(data);
    } else {
      this.myService["enableTimer"](
        1000,
        s => {
          this.registerForUpdates(s);
        },
        e => {
          this.displayError(e);
        }
      );
    }
  }

  registerForUpdates(data) {
    if (!data.RegisteredForUpdates) {
      this.myService["registerForUpdates"](
        s => {
          this.updateHandler(s);
        },
        e => {
          console.log(e);
        }
      );
    }
  }

  stopService() {
    this.myService["stopService"](
      s => {
        console.log("Service Stopped");
      },
      e => {
        alert("Error while stopping the service.");
      }
    );
  }
}
