import React, { Component } from 'react';
import {Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Body, Container, Content, Header, Left, Title} from 'native-base';

import CustomIcon from '../../../font/CustomIcon';

import LoginIMG from '../../../img/login.png';
import {NavigationEvents} from 'react-navigation';

import { observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import EmptyHeader from '../../components/EmptyHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

@observer
export default class Unauthticated extends Component {

    state ={
        loading:false
    }


    render () {


        return (
            <SafeAreaView style={[styles.container, {backgroundColor:'#F6F6F6', flex:1}]}>

                <EmptyHeader>
                    <View style={{marginRight:30}}>
                        <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack(null)}>
                            <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                        </TouchableOpacity>
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

                    <View style={[{minHeight: Dimensions.get('window').height-245}]}>

                                <View style={{display:'flex', height:Dimensions.get('window').height-200, justifyContent:'center', alignItems:'center'}}>
                                    <Image source={LoginIMG} style={{width:80, height:80}}/>
                                    <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:20, color:'#304555'}}>Üye olmalısın</Text>
                                    <Text style={{fontFamily:'Muli-SemiBold', marginTop:5, fontSize:15, color:'#304555', textAlign:'center'}}>maviden istediğin ayağına gelmesi için giriş yapmalısın</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}
                                                      style={{borderRadius:12, marginTop:20, marginBottom:10, height:38, backgroundColor:'#7FB7EA', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{color:'#fff', fontFamily:'Muli-ExtraBold'}}>Giriş yap</Text>
                                    </TouchableOpacity>
                                    <Text  style={{fontFamily:'Muli-Light', color:'#304555'}}>veya</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')} style={{borderWidth:1,borderRadius:12, marginTop:10, height:38, borderColor:'#7FB7EA', backgroundColor:'#fff', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{color:'#7FB7EA', fontFamily:'Muli-ExtraBold'}}>Kayıt ol</Text>
                                    </TouchableOpacity>
                                </View>
                    </View>

                </Content>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({});
