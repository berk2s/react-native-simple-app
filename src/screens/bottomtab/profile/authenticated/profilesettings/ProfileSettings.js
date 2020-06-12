import React, { Component } from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Body, Card, CardItem, Container, Content, Header, Input, Item, Left, Switch, Title, ListItem, Right, Button} from 'native-base';
import CustomIcon from '../../../../../font/CustomIcon';

import Spinner from 'react-native-loading-spinner-overlay';
import {observer} from 'mobx-react';

import ProfileSettingsForm from './ProfileSettingsForm';
import AuthStore from '../../../../../store/AuthStore';
import EmptyHeader from '../../../../components/EmptyHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

@observer
export default class ProfileSettings extends Component {

    state = {
        loading:false,
    }



  render() {
    return (
        <SafeAreaView style={[styles.container, {backgroundColor:'#F6F6F6', flex:1}]}>
            <EmptyHeader>
                <View style={{marginRight:30}}>
                    <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack(null)}>
                        <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                    </TouchableOpacity>
                </View>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>Profil ayarlarım</Title>
                </View>
            </EmptyHeader>

            <Spinner
                visible={this.state.loading}
                animation={'fade'}
                size={'small'}
            />
            <Content
                style={{display:'flex', flex:1, }}
                padder>

                <View style={styles.profileArea}>

                    <View style={styles.profileInfo}>

                        <View style={styles.profileCircle}>
                            <CustomIcon
                                name="person-fill"
                                size={25}
                                style={{color: '#fff'}}
                            />
                        </View>

                        <View style={styles.profileIntoTextArea}>
                            <Text style={{fontFamily:'Muli-ExtraBold', color:'#304555', fontSize:17}}>{AuthStore.getNameSurname}</Text>
                        </View>

                    </View>
                        <ProfileSettingsForm
                            userInfo={this.props.navigation.getParam('userInfo')}
                        />
                    </View>

            </Content>

        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    inputs:{
      marginBottom:10
    },
    inputInfoArea:{
        fontFamily:'Muli-Light',
        fontSize: 14,
        marginHorizontal:2,
        marginVertical: 10
    },
    accIcon:{
        marginLeft: 10,
        marginRight: 5,
        marginTop:1
    },
    input:{
        fontFamily:'Muli-SemiBold',
        fontSize:13,
        paddingLeft:15,
    },
    inputArea:{
        borderColor:'#fff',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:40,
        backgroundColor:'#fff',
        borderRadius:10,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 5,
    },
    inputFormArea:{
        marginVertical:15
    },
    profileIntoTextArea:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        paddingHorizontal:15,
        width:'70%',
    },
    profileCircle:{
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:'#8394CB',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        shadowColor: '#000',
        shadowOpacity:0.15,
        shadowRadius: 9,
        shadowOffset: {
            height: 0,
        },
        elevation:5,

        borderTopColor: 'transparent',

    },
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
