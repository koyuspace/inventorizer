# Inventorizer

Inventorizer is an inventarization software for your IT department. It allows you to create, modify and delete your devices in your database. Every device gets a QR Code you can scan with an app and change device information from the go. The apps are also protected against leakage of the binary files (copy protection) so your data is ensured to be safe.

## Building

### Desktop client

#### Dependencies

* NodeJS alongside NPM (installing via nvm preffered)
* Yarn
* Preferably a Linux box

#### Packaging

To package apps for the local platform:

```bash
$ yarn package
```

To package apps for all platforms:

First, refer to the [Multi Platform Build docs](https://www.electron.build/multi-platform-build) for dependencies.

Then,

```bash
$ yarn package-all
```

To package apps with options:

```bash
$ yarn package --[option]
```

To run End-to-End Test

```bash
$ yarn build-e2e
$ yarn test-e2e

# Running e2e tests in a minimized window
$ START_MINIMIZED=true yarn build-e2e
$ yarn test-e2e
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:

```bash
DEBUG_PROD=true yarn package
```

### Mobile client

Please refer to the [PhoneGap build manual](http://docs.phonegap.com/phonegap-build/).

## Hosting a server

### Dependencies

* Python 3 alongside PIP

### Installation

It's easy just like this:

```bash
$ sudo pip3 install -r requirements.txt
$ touch authorized.txt # Creating list with authorized users
$ python3 main.py
```
