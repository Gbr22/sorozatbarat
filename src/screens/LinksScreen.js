import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, Picker, Linking } from 'react-native';
import { getHomePageData, getDetails, getUserAgent, getLinks, getPlayEndURL } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 


export default class LinksScreen extends React.Component {
    state = {
        data:null,
    };
    url;
    openURL(url){

        getLinks(url).then((d)=>{
            this.setState({
                data:d
            })
        }).catch((err)=>{
            alert(err);
        })
    }
    componentDidMount(){
        this.url = this.props.route.params.url;
        this.openURL(this.url);
    }
    render(){
        var referer = this.url;
        var data = this.state.data;

        if (data == null){
            return (
                <View
                    style={styles.screenCont}
                >
                </View>
            )
        }

        var {url, items} = data;

        return (
            
            <View
                style={styles.screenCont}
            >
                <ScrollView
                    contentContainerStyle = {{
                        paddingBottom: 20,
                        paddingTop:10
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                        }}
                    >
                        <Text style={styles.h1}>{data.title.replace(" - ", " ").replace(" :: "," - ")}</Text>
                    </View>
                    {
                        items.map(e=>{
                            return (
                                <TouchableNativeFeedback
                                    key={e.title}
                                    onPress={()=>{
                                        console.log("open",e);
                                        getPlayEndURL(
                                            referer,
                                            e.url
                                        ).then(url=>{
                                            Linking.openURL(url).catch(err => {});
                                        })
                                    }}
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 20
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection:"row",
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex:1
                                            }}
                                        >
                                            <Text>{e.title}</Text>
                                            { e.uploader ? (
                                                <View
                                                    style={{
                                                        flexDirection:"row",
                                                    }}
                                                >
                                                    <Text>Feltöltő: </Text>
                                                    <TouchableOpacity
                                                        onPress={()=>{

                                                        }}
                                                    >
                                                        <Text style={styles.link}>{e.uploader.username}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : null }
                                        </View>
                                        <View>
                                            <Text>
                                                {e.viewcount}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            )
                        })
                    }
                </ScrollView>
            </View>
            
        )
    }
}
