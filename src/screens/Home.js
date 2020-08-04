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
    var series = props.route.params.series;
    return (
        <View><Text>{series.title}</Text></View>
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
                var imgHeight = 300 - 110;
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
                                    marginHorizontal: 5,
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
                                            borderRadius: 2
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View
                                    style={{
                                        
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center"
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
                            height: 300,
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
