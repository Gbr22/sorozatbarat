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
import SeriesDetailsScreen from './SeriesDetails';


const HomeStack = createStackNavigator();

export default function HomeScreen(props){
    return (
        <HomeStack.Navigator initialRouteName="Home">
            <HomeStack.Screen name="Home" component={Home} options={{ title:"Kezdőlap" }}/>
            <HomeStack.Screen name="Details" component={SeriesDetailsScreen} options={{ title:"Sorozat" }} />
        </HomeStack.Navigator>
    );
}
class Home extends React.Component {
    state = {
        homepageData:null
    };
  
    componentDidMount() {
        getHomePageData().then((d)=>{
            this.setState({
                homepageData:d,
            });
        })
        
    }
    render(){
        var data = this.state.homepageData;
        var props = this.props;

        if (!data){
            return (<View style={styles.screenCont}></View>);
        }

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
}
