import React, { Fragment } from 'react';
import LoadingContainer from '../components/LoadingContainer';

export default class BlogScreen extends React.Component {
    state = {
        data:null,
    };
    url;
    openURL(url){

    }
    componentDidMount(){
        this.url = this.props.route.params.url;
        this.openURL(this.url);
    }
    render(){
        return (
            <LoadingContainer></LoadingContainer>
        )
    }
}
