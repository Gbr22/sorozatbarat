react-native set-icon --platform android --path icon/icon.png --background "#FFA41B" &&
git restore android/app/src/main/AndroidManifest.xml #set-icon breaks AndroidManifest.xml, this reverses that