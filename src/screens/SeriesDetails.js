import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getHomePageData } from '../logic/homePageData';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

export default function SeriesDetailsScreen(props){
    var description = "Az 1973-as Feltámad a vadnyugat című film alapján készült sorozat a jövőbe kalauzolja el a nézőt. Helyszíne egy kalandpark, ahol szép kis summáért vakációzhat a lakosság tehetősebb része. A parkban robotok teszik élvezetessé és emlékezetessé a vakációzást, s a látogató elutazhat az egyes történelmi korokba: vadnyugatra, az ókori Rómába vagy éppen a lovagi játékokon párbajozhat. Azonban egy nap az egyik android öntudatra ébred és fellázad...";
    var tags = ["Amerikai", "Dráma", "Kaland", "Sci-Fi", "Thriller", "Western"];
    var seasons = ["01. évad", "02. évad", "03. évad"];
    var selectedSeason = seasons[seasons.length-1];
    var episodes = ["03. évad 01. rész", "03. évad 02. rész", "03. évad 03. rész", "03. évad 04. rész", "03. évad 05. rész", "03. évad 06. rész", "03. évad 07. rész", "03. évad 08. rész"];
    var item = props.route.params.series;
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
                            {2020}
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
                                        key={tag}
                                        style={[styles.textNormal]}
                                    >
                                        {tag}
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
                        
                        <View
                            style={{
                                
                                flex: 0,
                                flexShrink: 1,
                                backgroundColor: "hsl(0, 0%, 98%)",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                                overflow: "hidden",
                                
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.12,
                                shadowRadius: 2.22,

                                elevation: 1,

                            }}
                        >
                            {
                                seasons.map((e,i)=>{
                                    var first = i == 0;
                                    var last = i == seasons.length-1;
                                    var selected = selectedSeason == e;

                                    var s = [
                                        {
                                            paddingVertical: 5,
                                            paddingHorizontal: 10,
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
                                        <TouchableOpacity>

                                            <Text
                                                style={s}
                                                key={e}
                                            >
                                                {e}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                        
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
                                    <TouchableOpacity>
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
                                                {e}
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