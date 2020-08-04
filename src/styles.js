import { StyleSheet } from 'react-native';
import {StatusBar} from 'react-native';

var styles = StyleSheet.create({
    screenCont: {
      flex: 1,
      backgroundColor: '#fff',
    },
    screenScroll: {
      /* paddingTop: StatusBar.currentHeight + 10, */
    },
    screenScrollBottom: {
      height: /* (StatusBar.currentHeight + 10) +  */10,
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
}

export default styles;