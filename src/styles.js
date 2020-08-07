import { StyleSheet } from 'react-native';
import {StatusBar} from 'react-native';

var themeSettings = {
  "dark": {
    backgroundColor: "#231F1F",
    colorBold:"#E5E5E5",
    colorNormal:"#C4C4C4",
    colorThin:"#A0A0A0",
  },
  "light": {
    backgroundColor: "#fff",
    colorBold:"#000D",
    colorNormal:"#000D",
    colorThin:"#0009",
  }
}

function generateStyles(theme){
  var s =themeSettings[theme];
  var bg = themeSettings[theme].backgroundColor;
  var styles = StyleSheet.create({
    screenCont: {
      flex: 1,
      backgroundColor: bg,
    },
    container: {
      backgroundColor: bg,
      flex:1,
    },
    screenScroll: {
      /* paddingTop: StatusBar.currentHeight + 10, */
    },
    screenScrollBottom: {
      height: /* (StatusBar.currentHeight + 10) +  */10,
    },
    text: {
      color: s.colorBold,
    },
    link: {
      color:"#FFA600"
    },
    textNormal:{
      color: s.colorNormal,
      fontSize: 15
    },
    textSmall: {
      color: s.colorThin
    },
    h1: {
        fontSize: 25,
        fontWeight: "bold",
        color: s.colorBold,
        paddingVertical: 10
    }
  });
  var otherStyles = {
    screenPaddingHorizontal: 10,
    colors:{
      theme:'#FFA600',
    },
    theme:s,
  }
  return {styles,otherStyles};
}
var _styles = {
  "dark":generateStyles("dark"),
  "light":generateStyles("light"),
}

export function getStyles(scheme){
  var s = "light";
  if (scheme == "dark"){
    s = "dark";
  }
  return _styles[s];
}
var {styles, otherStyles} = getStyles("dark");
export default styles;
export var otherStyles;