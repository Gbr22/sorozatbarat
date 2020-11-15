import { Appearance, StyleSheet } from 'react-native';
import {StatusBar} from 'react-native';

var themes={
  dark:{
    backgroundColor: '#262626',
    refreshColor: '#404040',
    color:"#f2f2f2",
    theme:'#FFA600',
    divider:"#808080",
    ripple: "rgba(10, 10, 10, 0.5)",
    text:{
      nav:"#e6e6e6",
      default: "#f2f2f2",
      link:"#FFA600",
      normal: "#e6e6e6",
      small: "#bfbfbf",
      h1: "#f2f2f2",
    }
  },
  light:{
    backgroundColor: '#fff',
    refreshColor: '#f2f2f2',
    color:"#000D",
    theme:'#FFA600',
    divider:"#0005",
    ripple:'rgba(255, 255, 255, 0.5)',
    text:{
      nav:"#4f4f4f",
      default: "#000D",
      link:"#FFA600",
      normal: "#0009",
      small: "#0009",
      h1: "#000D",
    }
  }
}
var isDark = Appearance.getColorScheme() == "dark";
/* isDark = false; */
var currentTheme = isDark ? themes.dark : themes.light;

var styles = StyleSheet.create({
    screenCont: {
      flex: 1,
      backgroundColor: currentTheme.backgroundColor,
    },
    container: {
      backgroundColor: currentTheme.backgroundColor,
      flex:1,
    },
    screenScroll: {
      /* paddingTop: StatusBar.currentHeight + 10, */
    },
    screenScrollBottom: {
      height: /* (StatusBar.currentHeight + 10) +  */10,
    },
    text: {
      color: currentTheme.text.default,
    },
    link: {
      color: currentTheme.text.link,
    },
    textNormal:{
      color: currentTheme.text.normal,
      fontSize: 15
    },
    textSmall: {
      color: currentTheme.text.small
    },
    h1: {
        fontSize: 25,
        fontWeight: "bold",
        color: currentTheme.text.h1,
        paddingVertical: 10
    }
});
export var otherStyles = {
  screenPaddingHorizontal: 10,
  theme:currentTheme,
  colors:{
    theme:currentTheme.theme,
    divider:currentTheme.divider,
    color:currentTheme.color
  }
}

export default styles;