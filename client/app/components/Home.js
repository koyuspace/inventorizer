// @flow
import React, { Component } from 'react';
import Popup from "reactjs-popup";
import config from '../constants/config';
import styles from './Home.css';
import NewDevice from './NewDevice';
import {machineIdSync} from 'node-machine-id';
const icon = require('../icon.png');

window.$ = window.jQuery = require('jquery');
const { dialog } = require('electron').remote

import LocalizedStrings from 'react-localization';
 
let i18n = new LocalizedStrings({
 en:{
   error: "Error",
   error_unauthorized: "Your device is not authorized to access this application. For this reason the application must be terminated. More information can be retrieved from the log below.",
   file: "File",
   help: "Help",
   newdevice: "Add new device",
   quit: "Quit",
   docs: "Documentation",
   about: "About",
   hello: "Hello, ",
   instructions: "Please enter the device ID (this usually sticks below the QR code on the device)",
   deviceid: "Device ID",
   device: "Device",
   send: "Send",
   error_getentry: "Error while getting entry. The device ID might be wrong."
 },
 de: {
   error: "Fehler",
   error_unauthorized: "Ihr Gerät wurde für dieses Programm nicht zugelassen. Aus diesem Grund muss das Programm nun beendet werden. Weitere Informationen können Sie aus dem untenstehendem Log entnehmen.",
   file: "Datei",
   help: "Hilfe",
   newdevice: "Neues Gerät einrichten",
   quit: "Beenden",
   docs: "Dokumentation",
   about: "Über",
   hello: "Hallo, ",
   instructions: "Bitte geben Sie eine Device-ID an (diese klebt auf dem Gerät und steht unter dem QR-Code)",
   deviceid: "Device-ID",
   device: "Gerät",
   send: "Senden",
   error_getentry: "Fehler beim Laden des Eintrags. Die Device-ID ist möglicherweise falsch."
 }
});

var md5 = require('js-md5');

export default class Home extends Component {
  
  componentDidMount() {
    //Log machine ID
    console.log(md5(machineIdSync()));

    //Check if machine is authorized to run application
    $.get(config["api"] + "/api/v1/get/authorized/" + md5(machineIdSync()), function(data) {
    if (data["authorized"] === "false") {
      dialog.showErrorBox(i18n.error_unauthorized, JSON.stringify(data));
      window.close();
    } else {
      $("." + styles.dimmer).hide();
      $.get(config["api"] + "/api/v1/get/alias/" + md5(machineIdSync()), function(data) {
        $("#alias").html(data["alias"]);
      });
    }
    }).fail(function() {
      dialog.showErrorBox(i18n.error_unauthorized, "{\"authorized\": \"false\"}");
      window.close();
    });

    //New device button click event handler
    $(".newdev-btn").click(function() {
      window.setTimeout(function() {
        $(".header").html(i18n.newdevice);
      }, 50);
    });

    //Lookup device keypress event handler
    $("form").submit(function (e) {
      e.preventDefault();
      $("#dev-delbutton").show();
      localStorage.setItem("apicall", config["api"] + "/api/v1/set/entry/" + md5(machineIdSync()) + "/" + $("#deviceid").val());
      window.setTimeout(function() {
        $(".header").html(i18n.device);
        $(".view").hide();
        $(".newdev2").show();
        $.get(config["api"] + "/api/v1/get/entry/" + $("#deviceid").val() + "/" +  md5(machineIdSync()), function(data) {
          if (data === "") {
            dialog.showErrorBox(i18n.error, i18n.error_getentry);
            //window.location.reload();
          }
          $("#newdev-ip").val(data["ip"]);
          $("#newdev-ino").val(data["bill"]);
          $("#newdev-bno").val(data["boxn"]);
          $("#newdev-hostname").val(data["hostname"]);
          $("#newdev-location").val(data["location"]);
          $("#newdev-vendor").val(data["vendor"]);
          $("#newdev-type").val(data["type"]);
          $("#newdev-device").val(data["device"]);
          $("#newdev-deliverer").val(data["deliverer"]);
        }).fail(function() {
          dialog.showErrorBox(i18n.error, i18n.error_getentry);
          window.location.reload();
        });
      }, 50)
    });

    $(".newdev-btn").click(function() {
      $("#dev-delbutton").hide();
      localStorage.setItem("apicall", config["api"] + "/api/v1/new/entry" + "/" + md5(machineIdSync()));
    });
  }

  render() {
    return (
    <div>
      <div id="wrapper">
        <img src={icon} alt="Logo" />
        <div className={styles.dimmer}></div>
        <div className={styles.content}>
          <Popup trigger={<button className="pure-button pure-button-primary newdev-btn">{i18n.newdevice}</button>} modal>
            <NewDevice />
          </Popup><br /><br />
          <h1>{i18n.hello} <span id="alias"></span>!</h1>
          <h3 className={styles.instructions}>{i18n.instructions}</h3>
          <form>
            <p><input type="text" id="deviceid" placeholder={i18n.deviceid} /> <Popup trigger={<input type="submit" className="pure-button pure-button-primary lookup-dev" />} modal>
              <NewDevice />
            </Popup></p>
          </form>
        </div>
      </div>
    </div>
    );
  }
}
