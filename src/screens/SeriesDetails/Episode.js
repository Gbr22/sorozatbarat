import React, { Fragment } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TouchFeedback from '../../components/TouchFeedback';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import styles from '../../styles';
import { getUserAgent } from '../../logic/data';

export class Action extends React.PureComponent {

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

        var {color, icons, url} = this.props;
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
                    size={iconSize} color={active ? color : defColor}
                />
            </TouchableWithoutFeedback>
        )
    }
}

function getEpisodeInfo(imdb,e){
    if (!imdb){
        return null;
    }
    try {
        let season = parseInt(e.title.match(/[0-9]{2}(?=\. évad)/)[0]);
        let episode = parseInt(e.title.match(/[0-9]{2}(?=\. rész)/)[0]);

        let obj = imdb.seasons.find(e=>e.numSeason == season).episodes.find(e=>e.episode == episode);
        obj.season = season;
        obj.episode = episode;
        return obj;
    } catch(err){
        return null;
    }
}

export class Episode extends React.PureComponent {
    render(){
        let e = this.props.episode;
        let {imdb, navigation} = this.props;
        let info = getEpisodeInfo(imdb,e);

        

        function onclick(){
            navigation.navigate("Links", {
                url: e.url,
            });
        }        

        if (info) {
            function hasImage(){
                return info.urlPoster != "https://m.media-amazon.com/images/G/01/IMDb/spinning-progress.gif";
            }

            return (
            <View
            style={{
                marginHorizontal: 20,
                marginVertical: 12.5/2,
                borderRadius: 17.3,
                overflow: 'hidden',
            }}
            key={e.url}
            >
                <TouchFeedback
                >
                    <View
                        style={{
                            backgroundColor: "#313131",
                            padding: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            { hasImage() ? <View>
                                <Image 
                                    source={{uri:info.urlPoster}} 
                                    style={{
                                        height: 56.3,
                                        width: 100,
                                        resizeMode: 'contain',
                                        borderRadius: 9.6
                                    }}
                                />
                            </View> : null }
                            
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    flex: 1,
                                }}
                            >
                                <TouchableWithoutFeedback onPress={onclick}
                                    style={{
                                        paddingHorizontal: 8.6,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {info.season}. évad {info.episode}. rész
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#B8B8B8",
                                            fontSize: 13.3,
                                        }}
                                    >
                                        {info.title}
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    paddingLeft: 1.66,
                                    paddingRight: 3.33,
                                }}
                            >
                                <Action url={e.watched.url} active={e.watched.value} color="#00b300" icons={["eye","eyeo"]} />
                                <Action url={e.fav.url} active={e.fav.value} color="#e6b800" icons={["star","staro"]} />
                            </View>
                        </View>
                    </View>
                </TouchFeedback>
            </View>
            );
        }

        return (
            <TouchFeedback key={e.url}
                
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
                            onPress={onclick}
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
                    <View style={{paddingRight: 10}}>
                        <Action url={e.watched.url} active={e.watched.value} color="#00b300" icons={["eye","eyeo"]} />                
                    </View>
                    
                    <Action url={e.fav.url} active={e.fav.value} color="#e6b800" icons={["star","staro"]} last={true} />
                    
                </View>
            </TouchFeedback>
        )
    }
}