# Rect Native client for Availability

This is a React Native app that consumes the GraphQL API provided by the code in
`server/` built to support iOS and Android. To get started you should probably
read the [React Native website](https://facebook.github.io/react-native/).

The app was originally built using the wonderful
[Chatty](https://github.com/srtucker22/chatty)
[tutorial](https://medium.com/react-native-training/building-chatty-a-whatsapp-clone-with-react-native-and-apollo-part-1-setup-68a02f7e11).

It uses:
* The [GraphQL](http://graphql.org) protocol to talk to the server
* [Apollo Client](https://github.com/apollographql/apollo-client) to manage
  interactions with GraphQL
* [Redux](https://redux.js.org) to store state on the client
* [Geolocation](https://facebook.github.io/react-native/docs/geolocation.html)
  as built into React Native


## Install

To get started you'll need to install [NodeJS](https://nodejs.org/en/) with
your favourite package manager. Then install yarn:
```sh
npm install -g yarn
```

Install the react-native CLI tool:
```sh
npm install -g react-native-cli
```

Now clone the repo and cd to `client`:
```sh
git clone ...
cd availability-poc/client
```

Install dependencies:
```sh
yarn
```

If this doesn't work or something is missing you may want to check the React
Native guide for **Building Projects with Native Code**
[here](https://facebook.github.io/react-native/docs/getting-started.html).

At this point you have all the build tools you need to package the app but to
actually compile it for Android or iOS you'll need to install the associated
toolchains.

For iOS you must be running macOS and you should install the latest version of
Xcode. Make sure you have opened it at least once to install the command-line
development tools and accept the license agreement.

For Android download Android Studio, install and then use SDK Manager to
install an Android SDK and emulator.

From here you should probably follow the platform-specific instructions
[here](https://facebook.github.io/react-native/docs/running-on-device.html).
Even if you're just planning on running in the simulator/emulator you'll need
to follow these steps because our app requires custom native code.

Our project was built with `react-native init`.

For iOS you should be able to build and get running in the simulator with:
```sh
react-native run-ios
```

For Android you must create an AVD (Android Virtual Device) in Android Studio
and boot it in the emulator. Then you can build and run the app with:
```sh
react-native run-android
```


## Modifying native code

You can modify the files directly in the [`android/`](./android) or [`ios/`](./ios)
as needed to make changes to the apps you cannot make through React Native
directly. Where possible you should try to avoid this, though.

We can re-create the files in those directories using:
```sh
react-native eject
```
but this will cause all of these customisations to be lost so only do this if
you're prepared to rebase the changes on top of the fresh ejected project files.


## Deploy

Both the Android and iOS apps are currently configured to fetch updated React
Native JS bundles using [CodePush](http://microsoft.github.io/code-push/),
configured to use [@sdunster](https://github.com/sdunster)'s account.

New bundles can be built and deployed using code-push:
```sh
yarn run push-android
yarn run push-ios
```

To actually build and deploy the APK (Android) or IPA (iOS) you'll want to
follow the same
[instructions](https://facebook.github.io/react-native/docs/running-on-device.html)
from above but look for 'Building for production'.

## Configuration

You can change the GraphQL endpoint the app uses in
[`src/config.js`](./src/config.js).


## Contributing

Contributions of all kinds are welcomed but please attach screenshots to your
pull requests (ideally for both platforms) showing new functionality and/or an
explanation of what you did to verify your change doesn't cause a regression.