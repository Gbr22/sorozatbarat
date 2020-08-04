import { StyleSheet } from 'react-native';
import {StatusBar} from 'react-native';

var styles = StyleSheet.create({
    screenCont: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: StatusBar.currentHeight + 10,
      paddingHorizontal: 10
    },
    h1: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#000D"
    }
});
export default styles;