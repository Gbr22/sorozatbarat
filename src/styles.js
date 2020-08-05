import { StyleSheet } from 'react-native';
import {StatusBar} from 'react-native';

var styles = StyleSheet.create({
    screenCont: {
      flex: 1,
      backgroundColor: '#fff',
    },
    container: {
      backgroundColor: "#fff",
      flex:1,
    },
    screenScroll: {
      /* paddingTop: StatusBar.currentHeight + 10, */
    },
    screenScrollBottom: {
      height: /* (StatusBar.currentHeight + 10) +  */10,
    },
    text: {
      color: "#000D",
    },
    textNormal:{
      color: "#0009",
      fontSize: 15
    },
    textSmall: {
      color: "#0009"
    },
    h1: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#000D",
        paddingVertical: 10
    }
});
export var otherStyles = {
  screenPaddingHorizontal: 10,
  colors:{
    theme:'#FFA600',
  }
}

export default styles;