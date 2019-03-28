// @flow
import React, { Component } from 'react';
import styles from './NewDevice.css';
const loading = require('../loading.gif');
import {machineIdSync} from 'node-machine-id';
import config from '../constants/config';

window.$ = window.jQuery = require('jquery');
const { dialog } = require('electron').remote
var md5 = require('js-md5');

import LocalizedStrings from 'react-localization';
 
let i18n = new LocalizedStrings({
 en:{
    newdevice: "Add new device",
    instructions: "This wizard is helping you with adding a new device to the database. However we need some information about this new device to continue.",
    abort: "Abort",
    next: "Next >",
    ip: "IP address",
    ino: "Invoice number",
    bno: "Ethernet box number",
    hostname: "Hostname",
    location: "Location",
    vendor: "Vendor",
    type: "Type",
    device: "Device",
    deliverer: "Deliverer",
    ins2: "Enter your device info here. You can leave fields blank if you're unsure.",
    transmitting: "Transferring data...",
    done: "Done!",
    donetext: "You can now print the QR code with the \"print\" button",
    print: "Print",
    error_transmit: "An error occured while transferring the data to the database. This can be either traced back to an unstable or non-existant internet connection.",
    delete: "Delete",
    delete_sure: "Are you sure you want to delete that entry?",
    error_delete: "An error occured while deleting this entry."
  },
 de: {
    newdevice: "Neues Gerät einrichten",
    instructions: "Dieser Assistent hilft Ihnen beim Hinzufügen eines neuen Gerätes in die Datenbank. Wir benötigen ein paar Informationen über das Gerät um fortzufahren.",
    abort: "Abbrechen",
    next: "Weiter >",
    ip: "IP-Adresse",
    ino: "Rechnungsnummer",
    bno: "Dosennummer",
    hostname: "Hostname",
    location: "Ort",
    vendor: "Hersteller",
    type: "Typ",
    device: "Gerät",
    deliverer: "Ausgeliefert von",
    transmitting: "Übermittle Daten",
    done: "Fertig!",
    donetext: "Sie können den QR-Code nun über die Schaltfläche \"Drucken\" ausdrucken",
    print: "Drucken",
    error_transmit: "Bei der Übetragung der Daten an den Datenbankserver ist ein Fehler aufgetreten. Dies kann auf eine instabile oder nicht vorhandene Internetverbindung zurückführen.",
    delete: "Löschen",
    delete_sure: "Sind Sie sich sicher, dass Sie diesen Eintrag löschen möchten?",
    error_delete: "Ein Fehler ist beim Löschen des Eintrags aufgetreten."
 }
});


export default class NewDevice extends Component {
  
  componentDidMount() {
    $(".newdev2").hide();
    $(".newdev3").hide();
    $(".newdev4").hide();
    $("#dev-delbutton").hide();
    window.setInterval(function() {
      $(".popup-content").attr("style", "position: relative;background: rgb(255, 255, 255);width: 50%;margin: auto;border: 1px solid rgb(187, 187, 187);padding: 5px;height: 75%;overflow-y: scroll;overflow-x: hidden !important;");
    }, 20);
    $(".btn-transmit").click(function() {
      $(".view").hide();
      $(".newdev3").show();
      $.post(localStorage.getItem("apicall"), {
        ip: $("#newdev-ip").val(),
        bill: $("#newdev-ino").val(),
        boxn: $("#newdev-bno").val(),
        hostname: $("#newdev-hostname").val(),
        location: $("#newdev-location").val(),
        vendor: $("#newdev-vendor").val(),
        type: $("#newdev-type").val(),
        device: $("#newdev-device").val(),
        deliverer: $("#newdev-deliverer").val()
      }, function(data) {
        $(".view").hide();
        $(".newdev4").show();
        $("#newdev-qrcode").attr("src", "https://zxing.org/w/chart?cht=qr&chs=120x120&chld=L&choe=UTF-8&chl=" + data["success"]);
        $("#newdev-devid").html(data["success"]);
        $(".header-newdev4").html(i18n.done);
      }).fail(function() {
        dialog.showErrorBox(i18n.error_transmit, "{\"success\": \"false\"}");
        window.location.reload();
      });
    });
    $("#dev-delbutton").click(function() {
      $.get(config["api"] + "/api/v1/get/entry/" + $("#deviceid").val() + "/" +  md5(machineIdSync()), function(data) {
        if (confirm(i18n.delete_sure + "\n\n" + JSON.stringify(data))) {
          $.get(config["api"] + "/api/v1/delete/entry/" + md5(machineIdSync()) + "/" + $("#deviceid").val(), function(data) {
            window.location.reload();
          }).fail(function() {
            dialog.showErrorBox(i18n.error_delete, "{\"success\": \"false\"}");
            window.location.reload();
          });
        }
      }).fail(function() {
        dialog.showErrorBox(i18n.error_delete, "{\"success\": \"false\"}");
        window.location.reload();
      });
    });
  }

  render() {
    return (
      <div>
        <div className="view newdev">
            <div className={styles.modal}>
                <div className="header">{i18n.newdevice}</div>
                    <div className={styles.content + " " + styles.mod1}>
                        <h3>{i18n.instructions}</h3>
                    </div>
                    <p><a className="pure-button pure-button-primary" onClick={() => {$(".view").hide(); $(".newdev2").show();}} style={{float: "right", margin: "20px"}}>{i18n.next}</a></p>
                </div>
        </div>
        <div className="view newdev2">
        <div className={styles.modal}>
          <div className="header">{i18n.newdevice}</div>
                <div className={styles.content + " " + styles.mod2}>
                <p>{i18n.ip}</p>
                <p><input name="ip" type="text" id="newdev-ip" /></p>
                <p>{i18n.ino}</p>
                <p><input name="ino" type="text" id="newdev-ino" /></p>
                <p>{i18n.bno}</p>
                <p><input name="bno" type="text" id="newdev-bno" /></p>
                <p>{i18n.hostname}</p>
                <p><input name="hostname" type="text" id="newdev-hostname" /></p>
                <p>{i18n.location}</p>
                <p><input name="location" type="text" id="newdev-location" /></p>
                <p>{i18n.vendor}</p>
                <p><input name="vendor" type="text" id="newdev-vendor" /></p>
                <p>{i18n.type}</p>
                <p><input name="type" type="text" id="newdev-type" /></p>
                <p>{i18n.device}</p>
                <p><input name="device" type="text" id="newdev-device" /></p>
                <p>{i18n.deliverer}</p>
                <p><input name="deliverer" type="text" id="newdev-deliverer" /></p>
                </div>
                <p><a className="pure-button button-error" id="dev-delbutton" style={{float: "left", margin: "20px"}}>{i18n.delete}</a> <a className="pure-button pure-button-primary btn-transmit" style={{float: "right", margin: "20px"}}>{i18n.next}</a></p>
            </div>
        </div>
        <div className="view newdev3">
          <div className={styles.modal}>
            <div className="header">{i18n.newdevice}</div>
          </div>
          <div className={styles.content + " " + styles.mod1}>
            <img src={loading} alt="loading" /><br />{i18n.transmitting}
          </div>
        </div>
        <div className="view newdev4">
          <div className={styles.modal}>
            <div className="header header-newdev4">{i18n.newdevice}</div>
          </div>
          <div className={styles.content + " " + styles.mod2}>
            <div id="newdev-printscrn">
              <img alt="QR code" className={styles.printable} id="newdev-qrcode" />
              <p className={styles.printable} id="newdev-devid"></p>
            </div>
            <h3>{i18n.donetext}</h3>
            <a onClick={() => {
              window.$ = window.jQuery = require('jquery');

              $("#newdev-devid").attr("style", "padding-left: 28px;margin-top:-10px;font-size:9pt;");
              var printContents = document.getElementById("newdev-printscrn").innerHTML;
              var originalContents = document.body.innerHTML;
              document.body.innerHTML = printContents;
              window.print();
              document.body.innerHTML = originalContents;
              $("#newdev-devid").attr("style", "margin-top:-40px;font-size:9pt;");
              location.reload();
            }} className="pure-button pure-button-primary">{i18n.print}</a>
          </div>
        </div>
      </div>
    )
  }
}