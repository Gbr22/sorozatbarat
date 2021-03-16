import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, PixelRatio } from 'react-native';
import { getBlogs, getBlogsCache, getHomePageData } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SeriesDetailsScreen from './SeriesDetails';
import getStackItems, { getNavigator } from '../components/StackItems';
import CustomButton from '../components/CustomButton';
import { GlobalContext } from '../GlobalState';
import LoadingContainer from '../components/LoadingContainer';
import ErrorView from '../components/ErrorView';


const Stack = createStackNavigator();

export default function HomeScreen(props){
    return getNavigator(Stack,Blogs,"Blog");
}
class Blogs extends React.Component {
    state = {
        data:null,
        page:0,
        refreshing: true,
    };
    
    
    turnPage(page){
        getBlogsCache(this.state.page).then(d=>{
            this.setState({
                data:d,
                refreshing:false,
            });
            console.log(d);
        }).catch(err=>{
            this.setState({
                data:null,
                refreshing:false,
            });
        })
        this.setState({
            page,
            data:null,
            refreshing:true,
        })
    }

    componentDidMount() {
        console.log("pixel ratio",PixelRatio.get());
        this.turnPage(0);
    }

  
    render(){
        
        if (this.state.refreshing == true){
            return <LoadingContainer></LoadingContainer>;
        } else if (this.state.data == null){
            return <ErrorView></ErrorView>;
        } else {
            let {posts} = this.state.data;
            return (
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    keyExtractor={(e)=>e.url}
                    renderItem={({item})=>{
                        return (
                            <View
                                style={{
                                    marginHorizontal: 20,
                                    marginBottom: 20,
                                    backgroundColor: "#313131",
                                    borderRadius: 17,
                                    overflow: 'hidden',
                                }}
                            >
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255,0.2)",true)}
                                onPress={()=>{
                                    this.props.navigation.navigate("BlogPost", {
                                        url: item.url,
                                    });
                                }}
                                style={{
                                    padding: 16,
                                    borderRadius: 17,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            color: "#FFA41B",
                                        }}
                                    >{item.title}</Text>
                                    <Text
                                        style={{
                                            paddingVertical: 4.5,
                                            fontSize: 14,
                                            color: otherStyles.theme.text.normal,
                                        }}
                                    >
                                        {item.desc}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                        }}
                                    >
                                        
                                        <TouchableOpacity
                                            onPress={()=>{

                                            }}
                                            onPressOut={function(e){
                                                            
                                            }}
                                            onTouchEnd={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontStyle: "italic",
                                                    fontSize: 14,
                                                    color: otherStyles.theme.text.small,
                                                }}
                                            >{item.author} </Text>
                                        </TouchableOpacity>
                                        
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 6,
                                                color: otherStyles.theme.text.small,
                                            }}
                                        >{item.date.split(" ")[0]}</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            </View>
                        );
                    }}
                >
                </FlatList>
            </View>
            );
        }
        
    }
}
