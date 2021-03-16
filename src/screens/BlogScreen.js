import React, { Fragment } from 'react';
import ErrorView from '../components/ErrorView';
import LoadingContainer from '../components/LoadingContainer';
import styles, { otherStyles } from '../styles';
import { getBlogPost, openAnyLink } from '../logic/data';
import { Text, View } from 'react-native';
import HTML from 'react-native-render-html';
import { ScrollView } from 'react-native-gesture-handler';

export default class BlogScreen extends React.Component {
    state = {
        data:null,
        loading:true,
    };
    url;
    openURL(url){
        getBlogPost(url).then(d=>{
            this.setState({
                data:d,
                loading:false,
            })
        }).catch(err=>{
            this.setState({
                data:null,
                loading:false,
            })
        })
    }
    componentDidMount(){
        this.url = this.props.route.params.url;
        this.openURL(this.url);
    }
    render(){
        
        
        if (this.state.loading){
            return (<LoadingContainer></LoadingContainer>);
        } else if (this.state.data == null){
            return <ErrorView></ErrorView>;
        }
        let {html} = this.state.data;
        return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}
                contentContainerStyle={{
                    /* paddingTop: 20, */
                    padding: 20,
                }}
            >
                <HTML
                    source={{ html }}
                    onLinkPress={(e,href)=>{
                        openAnyLink(href,this.props.navigation);
                        console.log("link press",href);
                    }}
                    defaultTextProps={{
                        selectable:false,
                    }}
                    tagsStyles={{
                        "h1":{
                            textAlign:"center",
                        },
                        "a":{
                            color: otherStyles.theme.text.link,
                            textDecorationLine: 'none',
                        },
                        "p":{
                            paddingVertical: 5.3,
                        },
                        "img":{
                            marginVertical: 8.3,
                        },
                        "hr":{
                            backgroundColor: otherStyles.theme.text.normal,
                        }
                    }}
                    baseFontStyle={{
                        color: otherStyles.theme.text.normal,
                    }}
                />
            </ScrollView>
        </View>
        );
        
    }
}
