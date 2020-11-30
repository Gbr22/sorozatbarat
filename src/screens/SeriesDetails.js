import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, Picker, Linking, PixelRatio } from 'react-native';
import { getHomePageData, getDetails, getUserAgent } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons'; 
import LinearGradient from 'react-native-linear-gradient';

class Desc extends React.Component {
    state = {
        isDescOpen:false,
    }
    render(){
        var item = this.props.item;
        var description = item.description;
        function getShortDesc(){
            var words = description.split(" ");
            var len = 180;
            while (words.join(" ").length > len){
                words.pop();
            }
            var short = words.join(" ");
            if (short != description){
                short+="...";
            }
            
            return short;
        }
        var toggleDesc = ()=>{
            this.setState({
                isDescOpen:!this.state.isDescOpen
            })
        }
        return <View
            style={{
                paddingVertical: 5,
                paddingHorizontal: 20,
            }}
        >
            <TouchableWithoutFeedback
                onPress={toggleDesc}
            >
                <Text
                    style={{
                        color: "#FAFAFA",
                        fontSize: 14,
                    }}
                >
                    { this.state.isDescOpen ? description : getShortDesc() }
                </Text>
            </TouchableWithoutFeedback>
            <TouchableOpacity
                onPress={toggleDesc}
            >
                <Text
                    style={{
                        color: "#B1B1B1",
                        fontSize: 14,
                        textAlign: "center"
                    }}
                >{this.state.isDescOpen ? "Kevesebb" : "Több"}</Text>
            </TouchableOpacity>
        </View>
    }
}

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
        var score = null;

        function DetailIcon({width,height,url,img}){
            var loadInBrowser = () => {
                Linking.openURL(url).catch(err => {});
            };
            return (
                    <BouncePress
                        style={{
                            marginHorizontal: 6,
                            width,
                            height,
                        }}
                        onPress={()=>{
                            loadInBrowser();
                        }}
                    >
                        <View
                        >
                            <Image source={img}    
                                style={[
                                    detailsIcon,
                                    {
                                        height: height,
                                        width: width,
                                    }
                                ]}
                            />
                        </View>
                    </BouncePress>
                
            )
        }
        var s = 0.5;
        function getOriginalTitle(){
            if(!item.originalTitle){
                return null;
            }
            if (item.originalTitle.indexOf(`(${item.year})`) != -1) {
                return item.originalTitle;
            } else {
                return `${item.originalTitle} (${item.year})`;
            }
        }
        
        
        
        return (
            
            <View
                style={[styles.container, {
                    flexDirection: "column",
                    paddingHorizontal: 0,
                }]}
            >
        
                <FlatList
                    ListFooterComponent={
                        <View
                            style={{
                                height: 20,
                            }}
                        ></View>
                    }
                    ListHeaderComponent={
                        <Fragment>
                            <View
                                style={{
                                    paddingTop: 15,
                                    paddingBottom: 10,
                                    /* height: 250, */
                                    /* borderColor: "red",
                                    borderBottomWidth: 3, */
                                }}
                            >
                                <View
                                    style={{
                                        position:"absolute",
                                        top:0,
                                        bottom:0,
                                        left:0,
                                        right:0,
                                        flex:1,
                                    }}
                                >
                                    <Image
                                        source={{uri:item.image}}
                                        style={{
                                            flex:1
                                        }}
                                        resizeMode="cover"
                                        blurRadius={1}
                                    >
                                    </Image>
                                    <LinearGradient
                                        colors={['rgba(33, 33, 33,0.35)', 'rgb(33, 33, 33)']}
                                        style={{
                                            position:"absolute",
                                            top:0,
                                            bottom:0,
                                            left:0,
                                            right:0,
                                            flex:1,
                                        }}
                                    >
                                        
                                    </LinearGradient>
                                </View>
                                <View
                                    style={{
                                        justifyContent:"center",
                                        alignItems:"center",
                                        /* flex:1, */
                                    }}
                                >
                                    <Image
                                        source={{uri:item.image}}
                                        style={{
                                            width: 114,
                                            height: 171,
                                            borderRadius: 3,
                                            
                                            
                                        }}
                                        resizeMode="contain"
                                    >
                                    </Image>
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 21,
                                            color: "#FFFFFF",
                                        }}
                                    >{item.title}</Text>
                                    {
                                        getOriginalTitle() ? <Text
                                            style={{
                                                color:"#C1C1C1",
                                                fontSize: 16,
                                            }}
                                        >{getOriginalTitle()}</Text> : null
                                    }
                                </View>
                            </View>
                            <View
                                style={{
                                    height: 40,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                { porthu ? <DetailIcon width={238/54*18} height={18} img={require('../icons/porthu.png')} url={porthu} /> : null}
                                { imdb ? <DetailIcon width={143/54*18} height={18} img={require('../icons/imdb.png')} url={imdb} /> : null}
                                { score ? <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        /* borderWidth: 1,
                                        borderColor: "red", */
                                        marginHorizontal: 6,
                                    }}
                                >
                                    <Text style={{fontSize: 18, color: "#D3D3D3", fontWeight: "bold"}}>${score}</Text>
                                    <AntDesign style={{marginLeft:2, fontSize: 16, color: "#D3D3D3"}} name="star"></AntDesign>
                                </View> : null}
                            </View>
                            <View
                                style={{
                                    
                                    height: 47,
                                    
                                }}
                            >
                                <ScrollView
                                    horizontal={true}
                                    style={{
                                        flex: 1,
                                        height: 47,
                                    }}
                                    contentContainerStyle={{
                                        alignItems: "center",
                                        paddingHorizontal: 16,
                                    }}
                                    ref={ref => {this.scrollView = ref}}
                                    onContentSizeChange={() => this.scrollView.scrollToEnd()}
                                >
                                {
                                    seasons.map((e,i)=>{
                                        var active = e == selectedSeason;
                                        var url = e.url;
                                        return (
                                            <TouchableOpacity key={e.url}
                                                style={{
                                                    paddingHorizontal: 20,
                                                    paddingVertical: 8,
                                                    backgroundColor: active ? "#4A4134" : "#313131",
                                                    marginHorizontal: 3,
                                                    borderRadius: 35,
                                                }}
                                                onPress={() => {
                                                    this.openURL(url);
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize:14,
                                                        color: active ? "#FFA41B" : "#ffffff",
                                                    }}
                                                >
                                                    {e.title}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })
                                }
                                </ScrollView>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    paddingHorizontal: 20,
                                    paddingVertical: 5,
                                }}
                            >
                                { item.tags.map((tag,i)=>{
                                    return <View key={tag.url}
                                        style={{
                                            flexDirection: "row",
                                            
                                        }}
                                    >
                                        
                                        <TouchableOpacity
                                            
                                        >
                                            <Text
                                                
                                                style={{
                                                    color: "#FFE3BA",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {tag.title}
                                            </Text>
                                        </TouchableOpacity>
                                        {
                                            i != item.tags.length-1 ? <Text     
                                                style={{
                                                    color: "#B1B1B1",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {", "}
                                            </Text>: null 
                                        }
                                    </View>
                                })
                                }
                            </View>
                            <Desc item={item}></Desc>
                        </Fragment>
                    }
                    data={episodes}
                    keyExtractor={(item)=>{
                        return item.url;
                    }}
                    renderItem={({item})=>{
                        var e = item;
                        class Action extends React.Component {

                            state={
                                active:false
                            }
                            componentDidMount(){
                                this.setState({
                                    active:this.props.active
                                })
                            }

                            render(){
                                var iconSize = 20;
                                var defColor = "#808080";

                                var {color, last=false, icons, url} = this.props;
                                var active = this.state.active;
                                
                                return (
                                    <TouchableWithoutFeedback
                                        onPress={
                                            async ()=>{
                                                var result = await fetch(url, {
                                                    headers: {
                                                        "User-Agent":getUserAgent(),
                                                    }
                                                }).then(r=>{
                                                    return r.text();
                                                })
                                                if (result == "removed"){
                                                    this.setState({
                                                        active:false,
                                                    })
                                                } else if (result == "inserted"){
                                                    this.setState({
                                                        active:true,
                                                    })
                                                }
                                                
                                            }
                                        }
                                    >
                                        <AntDesign
                                            name={active==true ? icons[0] : icons[1]}
                                            size={iconSize} color={active ? color : defColor} style={{marginRight: last ? 0 : 10}}    
                                        />
                                    </TouchableWithoutFeedback>
                                )
                            }
                        }
                        

                        return (
                            <TouchFeedback key={e.title}
                                
                            >
                                <View
                                    style={{
                                        
                                        paddingHorizontal: 20,
                                        
                                        borderRadius: 12,
                                        /* borderWidth: 1,
                                        borderColor: "#e6e6e6", */
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                >
                                    <View style={{
                                        flex:1,
                                    }}>
                                        <TouchableWithoutFeedback
                                            style={{
                                                
                                                paddingVertical: 8,
                                            }}
                                            onPress={()=>{
                                                this.props.navigation.navigate("Links", {
                                                    url: e.url,
                                                });
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: styles.textNormal.color
                                                }}
                                            >
                                                {e.title}
                                            </Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <Action url={e.watched.url} active={e.watched.value} color="#00b300" icons={["eye","eyeo"]} />
                                    <Action url={e.fav.url} active={e.fav.value} color="#e6b800" icons={["star","staro"]} last={true} />
                                    
                                </View>
                            </TouchFeedback>
                        )
                    }}
                >

                </FlatList>
            </View>
    
        )
    }
}
