import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getHomePageData } from '../logic/homePageData';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const HomeStack = createStackNavigator();

export default function HomeScreen(props){
    return (
        <HomeStack.Navigator initialRouteName="Home">
            <HomeStack.Screen name="Home" component={Home} options={{ title:"Kezdőlap" }}/>
            <HomeStack.Screen name="Details" component={Details} options={{ title:"Sorozat" }} />
        </HomeStack.Navigator>
    );
}
function Details(props){
    var description = "Az 1973-as Feltámad a vadnyugat című film alapján készült sorozat a jövőbe kalauzolja el a nézőt. Helyszíne egy kalandpark, ahol szép kis summáért vakációzhat a lakosság tehetősebb része. A parkban robotok teszik élvezetessé és emlékezetessé a vakációzást, s a látogató elutazhat az egyes történelmi korokba: vadnyugatra, az ókori Rómába vagy éppen a lovagi játékokon párbajozhat. Azonban egy nap az egyik android öntudatra ébred és fellázad...";
    var tags = ["Amerikai", "Dráma", "Kaland", "Sci-Fi", "Thriller", "Western"];
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
                            arr = arr.reduce((arr, b) => [...arr, b, (
                                <View
                                    style={{
                                        width: 1,
                                        height: 12,
                                        flex:0,
                                        backgroundColor: "#0005",
                                        marginHorizontal: 5,
                                    }}
                                >
                                </View>
                            )], []);
                            arr.pop();
                            return arr;
                        })()
                    }
                    
                </View>
                <Text
                    selectable={true}
                >
                    { description }
                </Text>
            </View>
        </View>
    )
}

function Home(props) {
    var data = getHomePageData();


    return (
      <View style={styles.screenCont}>
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#0006" translucent = {true}/>
        <ScrollView style={styles.screenScroll}>
        {data.map(category=>{
            function renderItem({item}){
                var imageRatio = 136/200;
                var imgHeight = 280 - 110;
                var imgWidth = imgHeight * imageRatio;
                var cardPadding = 8;
                return (
                    <Fragment>
                        <BouncePress
                            onPress={()=>{
                                props.navigation.navigate("Details", {
                                    series: item,
                                });
                            }}
                        >
                            <View
                                style={{
                                    /* backgroundColor: "#EEE", */
                                    flex: 1,
                                    width: imgWidth + 2*cardPadding,
                                    marginHorizontal: 3,
                                    padding: cardPadding,
                                    borderRadius: 8,
                                    alignItems: "center"
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
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        paddingTop:5,
                                    }}
                                >
                                    <Text>{item.title}</Text>
                                </View>

                            </View>
                        </BouncePress>
                        
                    </Fragment>
                );
            }

            return (
                <Fragment key={category.title}>
                    <View
                        style={{
                            height: 290,
                        }}
                    >
                        <Text
                            style={[
                                styles.h1,
                                {
                                    paddingHorizontal: otherStyles.screenPaddingHorizontal
                                }
                            ]}
                        >{category.title}</Text>
                        <FlatList
                            data={category.data}
                            renderItem={renderItem}
                            keyExtractor={item => item.title}
                            horizontal={true}
                            style={{
                                /* paddingLeft: otherStyles.screenPaddingHorizontal */
                                
                            }}
                        >
                        </FlatList>
                    </View>
                </Fragment>
            );
            })}
            <View style={styles.screenScrollBottom}></View>
        </ScrollView>
        
      </View>
    );
}
