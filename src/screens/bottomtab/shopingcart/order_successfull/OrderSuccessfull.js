import React, { Component } from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LogoIMG from '../../../../img/logo.png';
import {Body, Left, Title, Right} from 'native-base';
import CustomIcon from '../../../../font/CustomIcon';
import {SafeAreaView} from 'react-native-safe-area-context';
import EmptyHeader from '../../../components/EmptyHeader';

export default class OrderSuccessfull extends Component {
  render() {
    return (
        <SafeAreaView style={styles.container}>


            <EmptyHeader>
                <View style={{marginRight:30}}>
                    <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.navigate('ShopingCard_')}>
                        <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                    </TouchableOpacity>
                </View>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Title style={styles.bodyTitleText}><Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>maviden</Text><Text style={{fontFamily:'Muli-ExtraBold', color:'#00CFFF'}}>iste</Text></Title>
                </View>
            </EmptyHeader>

        <View style={{backgroundColor:'#F6F6F6', display:'flex', justifyContent:'center', alignItems:'center', flex:1, marginTop:-5}}>

            <View style={{display:'flex', flexDirection:'column', width:176, marginBottom:35}}>
                <Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF', fontSize:28, textAlign:'center'}}>SİPARİŞİNİZ</Text>
                <Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF', fontSize:28, textAlign:'center'}}>ONAYLANDI</Text>
            </View>

            <View style={{display:'flex', flexDirection:'column', width:176, marginBottom:35}}>
                <Text style={{fontFamily:'Muli-Regular', color:'#00CFFF', fontSize:22, textAlign:'center'}}>En kısa sürede size ulaştıracağız</Text>
            </View>



                <View style={{display:'flex', justifyContent:'center',alignItems: 'center'}}>
                    <Image
                        source={LogoIMG}
                        style={{width:82, height:77}}
                    />
                </View>



        </View>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    header:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        height:Platform.OS == 'ios' ? 70 : 50,
        paddingLeft:10,
        paddingRight:10,
    },
    container:{
        backgroundColor:'#F6F6F6',
        flex:1,
        display:'flex'
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
});
