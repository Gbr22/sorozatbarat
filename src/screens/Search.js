import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, TextInput, AsyncStorage } from 'react-native';
import { getHomePageData, getAutocomplete, getHistory, removeHistory } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SeriesDetailsScreen from './SeriesDetails';
import getStackItems, {getNavigator} from '../components/StackItems';
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator();




export default function SearchScreen(props){
    return getNavigator(Stack,Search,"Keresés");
}

class History extends React.Component {
    state={
        history:[],
    }
    componentDidMount(){
        this.setState({
            history: getHistory(),
        })
    }
    renderItem = ({item})=>{
        var e = item;
        let navigation = this.props?.navigation;
        return (
            <TouchFeedback key={e.item.url}
                onPress={()=>{
                    navigation.navigate("Details", {
                        series: {url:e.url},
                        from:"search"
                    });
                }}
            >
                <View
                    style={{
                        paddingHorizontal:30,
                        paddingVertical: 8,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            height: 70,
                            width: 70 * 136/200,
                            marginRight: 12,
                            overflow: "hidden"
                        }}
                    >
                        <Image source={{uri:e.item.image}} 
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
                        }}
                    >
                        <Text
                            style={{
                                color: styles.text.color,
                            }}
                        >{e.item.title}</Text>
                        <Text
                            style={{
                                color: styles.textSmall.color,
                            }}
                        >{e.item.originalTitle ? e.item.originalTitle + ` (${e.item.year})` : e.item.year}</Text>
                    </View>
                    
                    <View
                        onStartShouldSetResponder={event => true}
                    >
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                paddingRight: 0
                            }}
                            onPress={()=>{
                                removeHistory(item).then(e=>{
                                    this.setState({
                                        history:getHistory()
                                    })
                                })
                            }}
                        >
                            <Feather name="x" size={15} color={otherStyles.theme.text.small} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </TouchFeedback>
        )
    }
    render(){
        
        let history = this.state.history.sort((a,b)=>b.time - a.time);
        
        return history.length > 0 ? 
            <FlatList
                style={{
                    flex:1,
                    borderColor: "green",
                    borderWidth: 1,
                }}
                overScrollMode="never"
                contentContainerStyle={{
                    paddingBottom: 65,
                }}
                ListHeaderComponent={
                    <Text
                        style={[
                            {
                                paddingHorizontal:30,
                            },
                            styles.h2,
                        ]}
                    >Legutóbbi keresések</Text>
                }
                

                data={history}
                
                keyExtractor={item => item.url}
                horizontal={false}
                renderItem={this.renderItem}
                style={{
    
                }}
            >
            </FlatList> : null;
    }
}


class Search extends React.Component {
    state = {
        query:"",
        results:null
    };
    
    searchBox;

    updateResults(){
        var q = this.state.query;
        getAutocomplete(q).then((d)=>{
            this.setState({
                results:d,
            });
            /* if (d.length == 1){
                var e = d[0];
                this.props.navigation.navigate("Details", {
                    series: {url:e.url},
                    from:"search"
                });
            } */
        })
    }
    componentDidMount(){
        
        /* var lastQ = "";
        setInterval(()=>{
            var q = this.state.query;
            if (q != lastQ){
                this.updateResults();      
            }
        },200); */
    }
    renderItem = ({item})=>{
        var e = item;
        let navigation = this.props?.navigation;
        return (
            <TouchFeedback key={e.url}
                onPress={()=>{
                    navigation.navigate("Details", {
                        series: {url:e.url},
                        from:"search"
                    });
                }}
            >
                <View
                    style={{
                        paddingHorizontal:30,
                        paddingVertical: 8
                    }}
                >
                    <Text
                        style={{
                            color: styles.text.color,
                        }}
                    >{e.label}</Text>
                </View>
            </TouchFeedback>
        )
    }
    render(){
        var props = this.props;
        let navigation = props.navigation;
        
        

        let onChangeText = (text)=>{
            
            this.setState({
                query:text
            })
            if (text.length >= 3){
                this.updateResults();    
            }
            
        }

        return (
            <View style={styles.screenCont}>
                <View style={styles.screenScroll}>
                    <View
                        style={{
                            height: 40,
                            borderRadius: 15,
                            margin: 20,
                            marginTop: 4,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            paddingHorizontal: 20,
                            elevation: 1,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <TextInput

                            ref={r=>this.searchBox = r}

                            placeholderTextColor={styles.textSmall.color}
                            style={{
                                
                                borderWidth: 0,
                                /* borderWidth: 1,
                                borderColor: otherStyles.colors.divider, */
                                backgroundColor: "transparent",

                                color: styles.text.color,
                                /* shadowColor: "red",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22, */
                                flexGrow: 1,
                                
                            }}

                            placeholder="Keresés"
                            selectionColor="rgba(255, 166, 0,0.7)"
                            onChangeText={text => onChangeText(text)}
                            returnKeyType="search"
                            onFocus={()=>{
                                if (!this.state.query){
                                    
                                }
                            }}
                            onSubmitEditing={()=>{
                                this.updateResults();
                            }}
                            value={this.state.query}
                        />
                        {
                        this.state.results != null && this.state.query != "" ?
                        <TouchableOpacity
                            onPress={()=>{
                                this.setState({query:""});
                            }}
                        >
                            <Feather name="x" size={15} color={otherStyles.theme.text.small} />
                        </TouchableOpacity> : null
                        }
                    </View>
                    {
                        this.state.query == "" ? <History navigation={navigation} /> : null
                    }
                    {
                        this.state.results != null && this.state.query != ""?
                            this.state.results.length > 0 ? 
                                <FlatList
                                    data={this.state.results}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.url}
                                    initialNumToRender={5}
                                    maxToRenderPerBatch={10}
                                    windowSize={10}
                                    horizontal={false}
                                    style={{
                                        
                                    }}
                                    contentContainerStyle={{
                                        paddingBottom:65
                                    }}
                                >
                                </FlatList>
                                : 
                                <View style={{
                                    justifyContent:"center",
                                    alignItems:"center"
                                  }}>
                                    <Text style={styles.textNormal}>Nincs találat</Text>
                                </View>
                            : <View>
                                
                            </View>
                    }
                </View>
                
            </View>
        );
    }
}
