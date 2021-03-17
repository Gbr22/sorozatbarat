import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, Picker, Linking, ToastAndroid, Alert } from 'react-native';
import { getHomePageData, getDetails, getUserAgent, getLinks, getPlayEndURL, getDownloadURL } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { playVideo } from '../logic/util';
import LoadingContainer from '../components/LoadingContainer';
import ExtSvg from '../icons/linkTags/ext.svg';
import PhoneSvg from '../icons/linkTags/phone.svg';
import HdSvg from '../icons/linkTags/hd.svg';


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
                <LoadingContainer></LoadingContainer>
            )
        }
        var {url, items} = data;
        let cleanTitle = data.title.replace(" - ", " ").replace(" :: "," - ");
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
                        <Text style={styles.h1}>{cleanTitle}</Text>
                    </View>
                    {
                        items.map(e=>{
                            function openLink(){
                                getPlayEndURL(
                                    referer,
                                    e.url
                                ).then(url=>{
                                    ToastAndroid.show("Indítás...",ToastAndroid.SHORT);
                                    console.log("starting link",e.tags);
                                    if (e.puremotion){
                                        getDownloadURL(url).then(json=>{
                                            /* console.log("download",json); */
                                            
                                            playVideo(json.videoUrl,json.subtitles[0]?.url, {title:cleanTitle});
                                        }).catch(err=>{
                                            /* var msg = err.message;
                                            if (err.message == "Missing video url"){
                                                msg = "Hiba, url nem található! Valószínúleg a videót törölték";
                                            }
                                            ToastAndroid.show(msg,ToastAndroid.LONG); */
                                            Alert.alert(
                                                "Hiba!",
                                                "Nem sikerült puremotion-el indítani a videót. Szertnéd megnyitni a linket böngészőben?",
                                                [
                                                  {
                                                    text: "Nem",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                  },
                                                  { text: "Igen", onPress: () => {
                                                    Linking.openURL(url);
                                                  } }
                                                ],
                                                { cancelable: true }
                                            );
                                        })
                                    } else {
                                        Linking.openURL(url);
                                    }
                                })
                            }
                            return (
                                <TouchFeedback
                                    key={e.title}
                                    onPress={openLink}
                                    
                                    style={{
                                        
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection:"row",
                                            paddingVertical: 10,
                                            paddingHorizontal: 20
                                        }}
                                    >
                                        
                                        <View
                                            style={{
                                                flex:1,
                                            }}
                                        >
                                                <View
                                                    style={{
                                                        flexDirection:'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexGrow: 1,
                                                        }}
                                                    >
                                                        <TouchableWithoutFeedback
                                                        >
                                                            <Text
                                                                style={{color:styles.textNormal.color}}
                                                            >{e.title}</Text>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    
                                                    <TouchableWithoutFeedback
                                                    >
                                                        <Text
                                                            style={{color:styles.textNormal.color}}
                                                        >
                                                            {e.viewcount}
                                                        </Text>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                                
                                            
                                                <View
                                                    style={{
                                                        flexDirection:"row",
                                                        marginTop: 2,
                                                        width: "100%",
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            flexGrow: 1,
                                                        }}
                                                    >
                                                        { e.uploader ? <Fragment>
                                                            <Text
                                                                style={{color:styles.textSmall.color}}
                                                            >Feltöltő: </Text>
                                                            
                                                            <View
                                                                onStartShouldSetResponder={event => true}
                                                            >
                                                                <TouchableOpacity
                                                                    onPressOut={function(e){
                                                                        
                                                                    }}
                                                                >
                                                                    <View>
                                                                        <Text style={styles.link}>{e.uploader.username}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </Fragment> : <Text style={{color:styles.textSmall.color}}>Feltöltő ismeretlen</Text>}
                                                    </View>
                                                    
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                        }}
                                                    >
                                                        {
                                                            e.tags?.reverse()?.map(tag=>{
                                                                function getImage(){
                                                                    function svg(I){
                                                                        return <I width={18} height={18} />;
                                                                    }
                                                                    if (tag.classes?.includes("plugin")){
                                                                        return svg(ExtSvg);
                                                                    }
                                                                    else if (tag.classes?.includes("hd")){
                                                                        return svg(HdSvg);
                                                                    }
                                                                    else if (tag.classes?.includes("mobile")){
                                                                        return svg(PhoneSvg);
                                                                    }
                                                                    else {
                                                                        return <Image
                                                                            style={{
                                                                                width: 20,
                                                                                height: 18,
                                                                                resizeMode: "contain",
                                                                            }}
                                                                            source={{uri:tag.image}}
                                                                        />;
                                                                    }
                                                                }

                                                                return (<View
                                                                    style={{
                                                                        flexDirection: "column",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        marginLeft: 5,
                                                                    }}
                                                                    key={tag.image}
                                                                    onStartShouldSetResponder={event => true}
                                                                >
                                                                    <TouchableWithoutFeedback
                                                                        onPress={()=>{
                                                                            Platform.select({
                                                                                android:(t)=>{
                                                                                    ToastAndroid.show(t,ToastAndroid.SHORT);
                                                                                },
                                                                                default:alert
                                                                            })(tag.text);
                                                                        }}
                                                                    >
                                                                        {getImage()}
                                                                    </TouchableWithoutFeedback>
                                                                </View>);
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                        
                                            
                                        </View>
                                    </View>
                                </TouchFeedback>
                            )
                        })
                    }
                </ScrollView>
            </View>
            
        )
    }
}
