import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, Picker, Linking, PixelRatio } from 'react-native';
import { getHomePageData, getDetails, getUserAgent, addHistory } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons'; 
import LinearGradient from 'react-native-linear-gradient';
import { Feather } from '@expo/vector-icons';
import LoadingContainer from '../components/LoadingContainer';
import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;
import ImdbSvg from "../icons/imdb.svg";
import PorthuSvg from "../icons/porthu.svg";
import { Modal } from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';


export default class GallerysScreen extends React.Component {
    state = {
        images:[]
    };
    
    componentDidMount(){
        this.setState({
            images:this.props.route.params.gallery.images
        })
    }
    
    render(){
        let viewerImages = this.props.route.params.gallery.images.map(e=>({
            url:e,
        }));

        return (
                <View
                    style={{
                        backgroundColor: "black",
                        flex:1,
                    }}
                >
                    <Modal visible={true} transparent={true}
                        onRequestClose={()=>{
                            this.props.navigation.goBack();
                        }}
                        
                        statusBarTranslucent={true}
                    >
                        
                            <ImageViewer imageUrls={viewerImages}
                                backgroundColor={"rgba(0,0,0,0.8)"}
                                useNativeDriver={true}
                                enablePreload={true}
                                menuContext={{
                                    saveToLocal: "Mentés",
                                    cancel:"Mégsem"
                                }}
                            />
                                           
                    </Modal>
                </View>
            
        )
    }
}
