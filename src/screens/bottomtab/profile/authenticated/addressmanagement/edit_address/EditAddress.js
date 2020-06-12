import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Body, Container, Content, Header, Left, Title} from 'native-base';
import CustomIcon from '../../../../../../font/CustomIcon';

import Spinner from 'react-native-loading-spinner-overlay';
import EditAddressForm from './EditAddressForm';
import EmptyHeader from '../../../../../components/EmptyHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

export default class EditAddress extends Component {

    state = {
        loading:false
    }


    render() {
    return (
        <SafeAreaView style={[styles.container, {backgroundColor:'#F6F6F6', flex:1}]}>
            <EmptyHeader>
                <View style={{marginRight:30}}>
                    <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack()}>
                        <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                    </TouchableOpacity>
                </View>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>Adres düzenle</Title>
                </View>
            </EmptyHeader>

            <Spinner
                visible={this.state.loading}
                animation={'fade'}
                size={'small'}
            />

            <Content
                style={{display:'flex', flex:1,}}
                padder>

                <EditAddressForm {...this.props} />

            </Content>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    profileInfo:{
        display:'flex',
        flexDirection:'row',
    },
    profileArea:{
        marginTop:15,
    },
    rightArea:{
        maxWidth:'65%'
    },
    bodyTitleText:{
        fontFamily:'Muli-ExtraBold',
        color:'#003DFF'
    },
    leftArea:{
        maxWidth:'15%'
    },
    backBtn:{
        display:'flex',
        justifyContent:'flex-end',
        alignItems:'flex-end'
    },
    body:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        maxWidth:'84.9%'
    },
});
