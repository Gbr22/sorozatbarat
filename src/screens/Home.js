import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl } from 'react-native';
import { getHomePageData } from '../logic/data';
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
        homepageData:null,
        refreshing: true,
    };
    
    updateData(force=false){
        return getHomePageData(force).then((d)=>{
            this.setState({
                homepageData:d,
            });
            return d;
        })
    }
    componentDidMount() {
        this.updateData().then(d=>{
            this.setRefreshing(false);
        })
    }

    setRefreshing(v){
        this.setState({
            refreshing: v,
        });
    }

    onRefresh() {
        this.setRefreshing(true);
        var t = this;
        this.updateData(true).then(() => {
            t.setRefreshing(false);
        });
    }
  
    render(){

        var data = this.state.homepageData;
        var props = this.props;
        var statusbar = <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#0006" translucent = {true}/>;

        if (!data){
            return (<View style={styles.screenCont}></View>);
        }

        return (
            <View style={styles.screenCont}>
                { statusbar }
                <ScrollView style={styles.screenScroll}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>{this.onRefresh()}} />
                    }
                >
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
