import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getHomePageData } from '../logic/homePageData';
import styles from '../styles';
import { FlatList } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';


export default function HomeScreen() {
    var data = getHomePageData();



    return (
      <View style={styles.screenCont}>
        {data.map(category=>{

            function renderItem({item}){
                var imageRatio = 136/200;
                var imgheight = 150;
                var bottomHeight = 50;
                var allHeight = 300;
                var allWidth = 100;
                return (
                    <Fragment>
                        <View
                            style={{
                                backgroundColor: "red",
                                flex: 1,
                                width: 150,
                                marginHorizontal: 5,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "yellow",
                                    height: imgheight
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
                                    backgroundColor: "blue",
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Text>{item.title}</Text>
                            </View>

                        </View>
                        
                    </Fragment>
                );
            }

            return (
                <Fragment key={category.title}>
                    <View
                        style={{
                            height: 250,
                        }}
                    >
                        <Text style={styles.h1}>{category.title}</Text>
                        <FlatList
                            data={category.data}
                            renderItem={renderItem}
                            keyExtractor={item => item.title}
                            horizontal={true}
                            style={{
                                
                            }}
                        >
                        </FlatList>
                    </View>
                </Fragment>
            );
        })}
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#0006" translucent = {true}/>
      </View>
    );
}
