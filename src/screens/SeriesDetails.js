import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, Picker, Linking } from 'react-native';
import { getHomePageData, getDetails } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

export default class SeriesDetailsScreen extends React.Component {
    state = {
        item:null,
        errored:false,
        errorMessage:null,
    };
    openURL(url){
        getDetails(url).then((d)=>{
            this.setState({
                item:d
            })
        }).catch((err)=>{
            this.setState({
                errorMessage:err.message,
                errored:true
            })
        })
    }
    componentDidMount(){
        this.openURL(this.props.route.params.series.url);
    }
    render(){
        var item = this.state.item;

        
        if (this.state.errored){
            return (
                <View
                    style={[
                        styles.container,
                        {
                            flex:1,
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.h1
                        ]}
                    >Hiba történt</Text>
                    <Text
                        style={[
                            styles.textNormal
                        ]}
                    >{this.state.errorMessage}</Text>
                </View>
            );
        }
        else if (!item) {
            return <View style={styles.container}></View>
        }
        

        var {description, tags, seasons, episodes, length, imdb, porthu} = item;
        var selectedSeason = seasons.filter(e=>e.active)[0] || seasons[seasons.length-1];
        
        var imageRatio = 136/200;
        var imgHeight = 280 - 110;
        var imgWidth = imgHeight * imageRatio;
        
        var detailsIcon = {
            
            resizeMode: 'contain',
        };

        function DetailIcon({width,height,url,img}){
            var loadInBrowser = () => {
                Linking.openURL(url).catch(err => {});
            };
            return (
                <BouncePress
                    onPress={()=>{
                        loadInBrowser();
                    }}
                >
                    <Image source={img}    
                        style={[
                            detailsIcon,
                            {
                                height: height,
                                width: width,
                                marginRight: 2
                            }
                        ]}
                    />
                </BouncePress>
            )
        }
        var s = 0.8;
        return (
            
            <View
                style={{
                    backgroundColor: "white",
                    flex:1
                }}
            >
                <ScrollView
                    contentContainerStyle = {{
                        paddingBottom: 20
                    }}
                >
    
                    <View
                        style={{
                            flex:0,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            padding: 20
                        }}
                    >
                        <View
                            style={{
                                height: imgHeight,
                                width: imgWidth,
                                overflow: "hidden"
                            }}
                        >
                            <Image source={{uri:item.image}} 
                                style={{
                                    flex: 1,
                                    borderRadius: 4
                                }}
                                resizeMode="contain"
                            />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "flex-start",
                                paddingLeft: 20,
                            }}
                        >
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        fontSize: 25,
                                        fontWeight: "bold"
                                    }
                                ]}
                            >
                                {item.title}
                            </Text>
                            <Text
                                style={[
                                    styles.textSmall,
                                    {
                                        fontSize: 18,
                                        
                                    }
                                ]}
                            >
                                {item.year}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection:"row",
                            paddingHorizontal: 20,
                            paddingBottom:15,
                            justifyContent: "flex-start",
                            alignItems:"center"
                        }}   
                    >
                        { imdb ? <DetailIcon width={64*s} height={32*s} img={require('../icons/imdb.png')} url={imdb} /> : null}
                        { porthu ? <DetailIcon width={76*s} height={32*s} img={require('../icons/porthu.png')} url={porthu} /> : null}
                        
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 20
                        }}
                    >
                        <View
                            style={{
                                marginBottom: 15,
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                flexWrap: "wrap"
                            }}
                        >
                            
                            {
                                (()=>{
                                    var arr = tags.map(tag=>{
                                        return (
                                            <TouchableOpacity>
                                                <Text
                                                    key={tag.url}
                                                    style={[
                                                        styles.textNormal,
                                                        {color:"#FFA600"}
                                                    ]}
                                                >
                                                    {tag.title}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    });
                                    arr = arr.reduce((arr, b) => [...arr, b, "|"], []).map((e,i)=>{
                                        if (e == "|"){
                                            return (
                                                <View
                                                    key={i}
                                                    style={{
                                                        width: 1,
                                                        height: 12,
                                                        flex:0,
                                                        backgroundColor: "#0005",
                                                        marginHorizontal: 5,
                                                    }}
                                                >
                                                </View>
                                            )
                                        }
                                        return e;
                                    });
                                    arr.pop();
                                    return arr;
                                })()
                            }
                            
                        </View>
                        <Text
                            
                        >
                            { description }
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "column"
                        }}
                    >
                        <View
                            style={{
                                flex:1,
                                padding: 20,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Picker
                                selectedValue={selectedSeason.url}
                                style={{ height: 50, width: 150, flex:1 }}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.openURL(itemValue);
                                }}
                                mode="dialog"
                            >
                                {
                                    seasons.map((e,i)=>{
                                        return (
                                            <Picker.Item label={e.title} key={e.url} value={e.url} />
                                        );
                                    })
                                }
                            </Picker>
                            
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 0,
                            }}
                        >
                            {
                                episodes.map(e=>{
                                    var iconSize = 20;
                                    var defColor = "#808080"
                                    return (
                                        <TouchFeedback key={e.title}>
                                            <View
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 20,
                                                    backgroundColor: "white",
                                                    borderRadius: 12,
                                                    /* borderWidth: 1,
                                                    borderColor: "#e6e6e6", */
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        flex:1
                                                    }}
                                                >
                                                    {e.title}
                                                </Text>
                                                <Feather name="eye" size={iconSize} color={defColor} style={{marginRight: 10}} />
                                                <Feather name="star" size={iconSize} color={defColor} />
                                                
                                            </View>
                                        </TouchFeedback>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
            
        )
    }
}
