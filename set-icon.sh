inkscape -w 1024 -h 1024 icon/icon.svg -o icon/icon.png &&
react-native set-icon --platform android --path icon/icon.png --background "#FFA41B" &&
git restore android/app/src/main/AndroidManifest.xml #set-icon breaks AndroidManifest.xml, this reverses that