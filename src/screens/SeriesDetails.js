import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
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
        

        var {description, tags, seasons, episodes} = item;
        var selectedSeason = seasons[seasons.length-1];
        
        var imageRatio = 136/200;
        var imgHeight = 280 - 110;
        var imgWidth = imgHeight * imageRatio;
        
    
        return (
    
            <View
                style={{
                    backgroundColor: "white",
                    flex:1
                }}
            >
                <ScrollView>
    
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
                            paddingHorizontal: 20
                        }}
                    >
                        <View
                            style={{
                                marginBottom: 15,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap"
                            }}
                        >
                            
                            {
                                (()=>{
                                    var arr = tags.map(tag=>{
                                        return (
                                        <Text
                                            key={tag.url}
                                            style={[styles.textNormal]}
                                        >
                                            {tag.title}
                                        </Text>
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
                            
                            <ScrollView

                                horizontal={true}
                                
                                style={{
                                    
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 2.22,
    
                                    elevation: 1,
                                    borderRadius: 10,
                                    backgroundColor: "hsl(0, 0%, 98%)",
                                    borderWidth: 0,
                                    overflow: "hidden",
                                }}
                                contentContainerStyle={{
                                }}
                            >
                                {
                                    seasons.map((e,i)=>{
                                        var first = i == 0;
                                        var last = i == seasons.length-1;
                                        var selected = e.active;
    
                                        var s = [
                                            {
                                                paddingVertical: 5,
                                                paddingHorizontal: 10,
                                                borderRadius: 10,
                                                shadowColor: "#000",
                                            }
                                        ];
                                        if (selected){
                                            s.push({
                                                backgroundColor: "#ffedcc",
                                                color: "#cc8500"
                                            })
                                        }
                                        
    
                                        return (
                                            <TouchableOpacity key={e.url}
                                                onPress={()=>{
                                                    this.openURL(e.url)
                                                }}
                                            >
    
                                                <Text
                                                    style={s}
                                                >
                                                    {e.title}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                            
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 20,
                            }}
                        >
                            {
                                episodes.map(e=>{
                                    var iconSize = 20;
                                    var defColor = "#808080"
                                    return (
                                        <TouchableOpacity key={e.title}>
                                            <View
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 12,
                                                    backgroundColor: "white",
                                                    borderRadius: 12,
                                                    borderWidth: 1,
                                                    borderColor: "#e6e6e6",
                                                    marginBottom: 8,
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
                                        </TouchableOpacity>
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
