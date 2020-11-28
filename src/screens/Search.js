import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, TextInput } from 'react-native';
import { getHomePageData, getAutocomplete } from '../logic/data';
import styles, { otherStyles } from '../styles';
import { FlatList, ScrollView, TouchableHighlight, TouchableNativeFeedback } from 'react-native-gesture-handler';
import TouchFeedback from '../components/TouchFeedback';
import BouncePress from '../components/BouncePress';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SeriesDetailsScreen from './SeriesDetails';
import getStackItems, {getNavigator} from '../components/StackItems';


const Stack = createStackNavigator();


export default function SearchScreen(props){
    return getNavigator(Stack,Search,"Keresés");
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
            if (d.length == 1){
                var e = d[0];
                this.props.navigation.navigate("Details", {
                    series: {url:e.url},
                });
            }
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
  
    render(){

        var props = this.props;

        let onChangeText = (text)=>{
            this.setState({
                query:text
            })
            
        }
        

        return (
            <View style={styles.screenCont}>
                <View style={styles.screenScroll}>
                    <View>
                        <TextInput

                            ref={r=>this.searchBox = r}

                            placeholderTextColor={styles.textSmall.color}
                            style={{
                                height: 40,
                                borderRadius: 15,
                                margin: 20,
                                marginTop: 20,
                                borderWidth: 1,
                                borderColor: otherStyles.colors.divider,
                                paddingHorizontal: 20,

                                color: styles.text.color,
                                /* shadowColor: "red",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22, */

                                elevation: 1,
                            }}

                            placeholder="Keresés"
                            
                            onChangeText={text => onChangeText(text)}
                            onFocus={()=>{
                                if (!this.state.query){
                                    
                                }
                            }}
                            onSubmitEditing={()=>{
                                this.updateResults();
                            }}
                            value={this.state.query}
                        />
                    </View>
                    {
                        this.state.results != null ?
                            this.state.results.length > 0 ? 
                                <FlatList
                                    data={this.state.results}
                                    renderItem={({item})=>{
                                        var e = item;
                                        return (
                                            <TouchFeedback key={e.url}
                                                onPress={()=>{
                                                    props.navigation.navigate("Details", {
                                                        series: {url:e.url},
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
                                    }}
                                    keyExtractor={item => item.url}
                                    horizontal={false}
                                    style={{

                                    }}
                                >
                                </FlatList>
                                : <View style={{
                                    justifyContent:"center",
                                    alignItems:"center"
                                  }}>
                                    <Text style={styles.textNormal}>Nincs találat</Text>
                                </View>
                            : <Fragment></Fragment>
                    }
                </View>
                
            </View>
        );
    }
}
