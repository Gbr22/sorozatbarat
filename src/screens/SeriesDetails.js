import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, Picker, Linking } from 'react-native';
import { getHomePageData, getDetails, getUserAgent } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 

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
                style={styles.container}
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
                                            <TouchableOpacity
                                                key={tag.url}
                                            >
                                                <Text
                                                    
                                                    style={[
                                                        styles.textNormal,
                                                        styles.link
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
                                                        backgroundColor: otherStyles.colors.divider,
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
                            style={{color: styles.textSmall.color}}
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
                                style={{ height: 50, width: 150, flex:1, color:styles.textNormal.color }}
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
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
            
        )
    }
}
