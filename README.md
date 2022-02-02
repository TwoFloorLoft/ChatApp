# ChatApp

The project has been developed with expo and currently requires expo start to start. Using expo a web version is available as an alternative to using a physical device (i.e.an IOS/Android phone). Emulators are also available should physical devices be unavailable.

Google Firebase is used as the database which can store new messages and for the messages to be retrieved. The configuration string is created within the settings and stored with the application component.

Google Storage is use to store picturess (blobs).

<h1>Pre-requirements</h1>
To install expo npm install expo-cli --global expo init

<h1>Instalation</h1>
npm install --save react-navigation
npm install @react-navigation/native @react-navigation/stack
expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install react-native-gifted-chat --save
expo install expo-permissions
expo install expo-image-picker
expo install expo-location
expo install react-native-maps
