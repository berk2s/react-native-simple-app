import React, { Component } from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Body, Container, Content, Header, Left, Title} from 'native-base';
import CustomIcon from '../../../../../../font/CustomIcon';
import Spinner from 'react-native-loading-spinner-overlay';
import OrderWaiting from '../../../../../../img/waiting_order.png';
import Ripple from 'react-native-material-ripple';
import OrderEnroute from '../../../../../../img/delivery-man.png';
import OrderPreparing from '../../../../../../img/orderpre.png';
import DoneIMG from '../../../../../../img/tick.png';
import NextIMG from '../../../../../../img/next.png';
import CancelIMG from '../../../../../../img/cross.png';

import ProfileAddress from '../../../../../../img/profile_address.png'

import {IMAGE_URL} from 'react-native-dotenv'

import Timeline from 'react-native-timeline-flatlist'
import EmptyHeader from '../../../../../components/EmptyHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

export default class OrderDetail extends Component {

    state = {
        loading:false,
        months:[
            {month: '01', text: 'Ocak'},
            {month: '02', text: 'Şubat'},
            {month: '03', text: 'Mart'},
            {month: '04', text: 'Nisan'},
            {month: '05', text: 'Mayıs'},
            {month: '06', text: 'Haziran'},
            {month: '07', text: 'Temmuz'},
            {month: '08', text: 'Ağustos'},
            {month: '09', text: 'Eylül'},
            {month: '10', text: 'Ekim'},
            {month: '11', text: 'Kasım'},
            {month: '12', text: 'Aralık'},
        ]
    }


    dateCustomize = e => {
        const split = e.split('T');
        const splitOfSplit = split[0].split('-');
        const year = splitOfSplit[0];
        const month = splitOfSplit[1];
        const day = splitOfSplit[2];
        const mapIt = this.state.months.map(e => e.month).indexOf(''+month);

        return `${day} ${this.state.months[mapIt].text} ${year}`
    }
// LOG  2020-03-24T20:18:35.890Z
    timeCustomize = e => {
        const split = e.split('T');
        const splitOfSplit = split[1].split(':');
        const hour = splitOfSplit[0];
        const minut = splitOfSplit[1];

        return `${hour}:${minut}`
    }

  render() {
        const order = this.props.navigation.getParam('order')
    return (
        <SafeAreaView style={[styles.container, {backgroundColor:'#F6F6F6', flex:1}]}>
            <EmptyHeader>
                <View style={{marginRight:30}}>
                    <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack(null)}>
                        <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                    </TouchableOpacity>
                </View>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>Sipariş bilgileri</Title>
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

                <View style={styles.headerAreaOrder}>
                    <Text style={styles.headerOrderText}>Sipariş - #{order.visibility_id}</Text>

                    <View style={styles.detailTexts}>
                        {
                            order.is_bluecurrier == true
                                ?
                                <Text style={[styles.headerOrderText2, {fontSize:13}]}><><Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF', fontSize:13}}>mavi</Text><Text style={{fontFamily:'Muli-ExtraBold', color:'#00CFFF', fontSize:13}}>kurye</Text></> siparişi</Text>

                                :
                                <Text style={[styles.headerOrderText2, {fontSize:13}]}><><Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF', fontSize:13}}>maviden</Text><Text style={{fontFamily:'Muli-ExtraBold', color:'#00CFFF', fontSize:13}}>iste</Text></> siparişi</Text>

                        }

                        <View style={styles.area2}>
                            <Text style={styles.headerOrderText2}>{this.dateCustomize(order.order_date)}</Text>
                            {
                                order.price != null && <Text style={styles.headerOrderText2}>Tutar: <Text style={{fontFamily:'Muli-ExtraBold', fontSize:16}}>{order.price} TL</Text></Text>
                            }

                        </View>
                    </View>
                </View>

                <View>
                    <View style={styles.timeline}>
                        <Timeline
                            showTime={false}
                            innerCircle={'icon'}
                            listViewStyle={{width:160}}
                            circleSize={35}
                            circleColor={'#F6F6F6'}
                            lineWidth={3}
                            titleStyle={{fontFamily:'Muli-Bold', marginTop:-4, marginLeft:5}}
                            descriptionStyle={{height:50, fontFamily:'Muli-Regular', marginTop:3, marginLeft:5}}
                            data={[
                                {time: '09:00', lineColor:order.order_history_success != null ? '#CDDC39' : '#304555', icon:DoneIMG, title: order.order_history_success != null && 'Teslim edildi',description: order.order_history_success != null ? this.timeCustomize(order.order_history_success) : ''},
                                {time: '09:00', lineColor:order.order_history_enroute != null ? '#CDDC39' : '#304555', icon:OrderEnroute, title: order.order_history_enroute != null && 'Sipariş yolda', description: order.order_history_enroute != null ? this.timeCustomize(order.order_history_enroute) : ''},
                                {time: '09:00',  lineColor:order.order_history_prepare != null ? '#CDDC39' : '#304555', icon:OrderPreparing, title: order.order_history_prepare != null && 'Hazırlanıyor',description:order.order_history_prepare != null ? this.timeCustomize(order.order_history_prepare) : ''},
                                {time: '09:00',  descriptionStyle:{height:20}, icon:OrderWaiting, title: 'Sipariş onayı', description: order.order_history_prepare != null ? 'Onaylandı' : 'Onay bekliyor'},
                            ]}
                        />
                    </View>
                </View>

                {
                    order.products != null
                    &&
                    <View style={styles.productsArea}>
                        <View style={styles.productsAreaInfo}>
                            <Text style={styles.productsAreaText}>Ürünler</Text>
                        </View>

                        <View style={styles.currentOrdersListArea}>

                            {order.products.map(e => {
                                const imageUrl = IMAGE_URL+e.product_image;
                                return <View style={styles.orderCard} key={e.id}>
                                    <View style={styles.imageArea}>
                                        <Image
                                            style={styles.cardImg}
                                            source={{uri: imageUrl}}
                                        />
                                    </View>

                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardInfoText}>{e.product_name}</Text>
                                        <Text style={styles.cardInfoText2}>{e.count} adet</Text>
                                    </View>
                                </View>
                            })}


                        </View>

                    </View>
                }


                <View style={[styles.productsArea, {marginVertical:5}]}>

                    <View style={styles.currentOrdersListArea}>

                        <View style={styles.orderCard}>
                            <View style={[styles.imageArea, {justifyContent:'flex-start', alignItems: 'center'}]}>
                                <Image
                                    style={styles.cardImg2}
                                    source={ProfileAddress}
                                />
                            </View>

                            <View style={[styles.cardInfo, {justifyContent:'flex-start'}]}>
                                <Text style={[styles.cardInfoText, {width:'100%'}]}>Sipariş Adresi ({order.user_address.address_title})</Text>
                                <Text style={{fontFamily:'Muli-Regular', color:'#6C7277', marginVertical:2, marginRight:5,}}>{order.user_address.address}</Text>
                                <Text style={{fontFamily:'Muli-Regular', color:'#6C7277', marginVertical:2, marginRight:5}}>{order.user_address.address_direction != null && `(${order.user_address.address_direction})`}</Text>
                            </View>
                        </View>

                    </View>

                </View>

            </Content>

        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    cardInfoText2:{
        fontFamily:'Muli-Regular',
        color:'#304555',
        fontSize:14,
        flexWrap:'wrap',
        width:'85%'
    },
    imageArea:{
      display:'flex',
      justifyContent:'center'
    },
    cardInfoText:{
      fontFamily:'Muli-Bold',
      color:'#304555',
      fontSize:16,
        flexWrap:'wrap',
        width:'78%'
    },
    cardInfo:{
        width:'100%',
        display:'flex',
        justifyContent:'space-between'
    },
    cardImg2:{
        width:32,
        height:32,
        marginRight:15
    },
    cardImg:{
      width:65,
      height:65,
        marginRight:15
    },
    orderCard:{
        minHeight:100,
        backgroundColor:'#fff',
        shadowColor: "#304555",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        padding:15,
        display:'flex',
        flexDirection:'row',
       // alignItems: 'center'
    },
    currentOrdersListArea:{
        display:'flex',
        flexDirection:'column',
        marginVertical:15
    },
    productsAreaText:{
      fontFamily:'Muli-ExtraBold',
      color:'#434F58',
      fontSize:22,
    },
    productsArea:{

    },
    timeline:{
        marginVertical:30
    },
    detailTexts:{
      marginVertical:10
    },
    headerOrderText2:{
        fontFamily:'Muli-Regular',
        color:'#434F58',
        marginVertical: 2
    },
    area2:{
      display:'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    headerOrderText:{
      fontFamily: 'Muli-ExtraBold',
      fontSize:24,
      color:'#434F58'
    },
    headerAreaOrder:{
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
    body:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        maxWidth:'84.9%'
    },
});
