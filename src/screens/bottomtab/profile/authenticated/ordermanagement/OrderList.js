import React, { Component } from 'react';
import {Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Body, Container, Content, Header, Left, Title} from 'native-base';
import CustomIcon from '../../../../../font/CustomIcon';

import Spinner from 'react-native-loading-spinner-overlay';
import EmptyIMG from '../../../../../img/noorder.png';
import Ripple from 'react-native-material-ripple';

import OrderWaiting from '../../../../../img/waiting_order.png';
import OrderPreparing from '../../../../../img/orderpre.png';
import OrderEnroute from '../../../../../img/delivery-man.png';
import NextIMG from '../../../../../img/next.png';
import DoneIMG from '../../../../../img/tick.png';
import CancelIMG from '../../../../../img/cross.png';
import {min} from 'react-native-reanimated';
import EmptyHeader from '../../../../components/EmptyHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

const HEADER_MAX_HEIGHT=55
const HEADER_MIN_HEIGHT=0
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT


export default class OrderList extends Component {

  state = {
    loading:false,
    scrollY:new Animated.Value(0),
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


  /*

   <View style={{display:'flex', height:Dimensions.get('window').height-200, justifyContent:'center', alignItems:'center'}}>
      <Image source={EmptyIMG} style={{width:90, height:90}}/>
      <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:20, color:'#304555'}}>Hiç siparişin yok</Text>
      <Text style={{fontFamily:'Muli-SemiBold', marginTop:5, fontSize:15, color:'#304555'}}>maviden iste, ayağına gelsin</Text>
   </View>

   */

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
    let headerHeight;
    if(Platform.OS === 'ios'){
      headerHeight = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
      });
    }else{
      headerHeight = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MAX_HEIGHT],
        extrapolate: 'clamp',
      });
    }
    return (
        <SafeAreaView style={[styles.container, {backgroundColor:'#F6F6F6', flex:1}]}>
          <Animated.View style={{height:headerHeight}}>

          <EmptyHeader>
            <View style={{marginRight:30}}>
              <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack(null)}>
                <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
              </TouchableOpacity>
            </View>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
              <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>Siparişlerim</Title>
            </View>
          </EmptyHeader>

          </Animated.View>




          <Spinner
              visible={this.state.loading}
              animation={'fade'}
              size={'small'}
          />


          <Content
              style={{display:'flex', flex:1,}}

              scrollEventThrottle={16}
              onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
              )}

              bounces={(this.props.navigation.getParam('opened_orders').data.length + this.props.navigation.getParam('history_orders').data.length) > 4}



              padder>

            <View style={styles.orderList}>

              {
                this.props.navigation.getParam('opened_orders').data.length > 0
                    ?
                      <View style={styles.currentOrders}>

                        <View style={styles.currentOrdersListArea}>

                          {this.props.navigation.getParam('opened_orders').data.map(e => {
                              return <View style={styles.orderCard} key={e._id}>

                                <View style={styles.cardHeader}>
                                  <Text style={styles.cardHeaderText}>Sipariş - #{e.visibility_id}</Text>


                                    {
                                      e.products != null
                                        ?
                                          <Text style={styles.cardHeaderText2}>
                                            {e.products.length != 1
                                            ?
                                              <Text>{e.products[0].product_name} ve {e.products.length-1} ürün daha</Text>
                                            :
                                              <Text>Sadece {e.products[0].product_name}</Text>}
                                          </Text>
                                          :
                                          <></>
                                    }



                                </View>


                                <View style={styles.orderStatus}>

                                  {
                                    e.order_status == 0 &&  <Image source={OrderWaiting} style={styles.orderImage}/>
                                  }
                                  {
                                    e.order_status == 1 &&  <Image source={OrderPreparing} style={styles.orderImage}/>
                                  }
                                  {
                                    e.order_status == 2 &&  <Image source={OrderEnroute} style={styles.orderImage}/>
                                  }


                                  <Text style={styles.orderStatusText}>
                                    {e.order_status == 0 && 'Onay bekliyor'}
                                    {e.order_status == 1 && 'Hazırlanıyor'}
                                    {e.order_status == 2 && 'Siparişin yolda'}
                                  </Text>

                                </View>

                                <View style={styles.cardBottom}>

                                  <Ripple onPress={() => this.props.navigation.navigate('OrderDetail', {order:e})}>
                                    <View style={styles.detailOrder}>
                                      <Text style={styles.detailOrderText}>Detaylar</Text>
                                    </View>
                                  </Ripple>

                                </View>

                              </View>
                          })}

                        </View>

                      </View>
                    :
                    <></>
              }


              <View style={styles.currentOrders}>

                <View style={styles.infoTextArea}>
                  <Text style={styles.infoText}>Geçmiş Siparişler</Text>
                </View>

                <View style={styles.currentOrdersListArea}>

                  {
                    this.props.navigation.getParam('history_orders').data.length > 0
                        ?
                        this.props.navigation.getParam('history_orders').data.map((e) => {
                            return <View style={styles.orderCard} key={e._id}>

                              <View style={styles.cardHeader}>
                                <Text style={styles.cardHeaderText}>Sipariş - #{e.visibility_id}</Text>
                                <Text style={[styles.cardHeaderText2, {marginVertical:10}]}>{this.dateCustomize(e.order_date)}{e.products != null ? ', '+e.products.length+' ürün,' : ''} {this.timeCustomize(e.order_date)}</Text>
                              </View>

                              <View style={[styles.orderStatus, {display:'flex', flexDirection:'row', justifyContent:'space-between', marginVertical: 0, paddingVertical:0}]}>


                                <View style={{display:'flex', flexDirection:'row'}}>

                                  {
                                    e.order_status == 3 &&  <Image source={DoneIMG} style={[styles.orderImage, {width:20, height:20}]}/>
                                  }
                                  {
                                    e.order_status == -1 &&  <Image source={CancelIMG} style={[styles.orderImage, {width:20, height:20}]}/>
                                  }

                                  <Text style={styles.orderStatusText}>
                                    {e.order_status == 3 && 'Teslim edildi'}
                                    {e.order_status == -1 && 'İptal edildi'}
                                  </Text>

                                </View>

                                <View>
                                  {!e.is_bluecurrier && <Title><Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF', fontSize:12}}>maviden</Text><Text style={{fontFamily:'Muli-ExtraBold', color:'#00CFFF', fontSize:12}}>iste</Text></Title>}
                                  {e.is_bluecurrier && <Title><Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF', fontSize:12}}>mavi</Text><Text style={{fontFamily:'Muli-ExtraBold', color:'#00CFFF', fontSize:12}}>kurye</Text></Title>}
                                </View>

                              </View>

                              {e.order_status != -1 && <View style={styles.nextArrowArea}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderDetail', {order:e})}>
                                  <Image
                                      source={NextIMG}
                                      style={{width:22, height:22}}
                                  />
                                </TouchableOpacity>
                              </View>}


                            </View>

                        })

                        :
                        <></>
                  }

                </View>

              </View>

            </View>

          </Content>

        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  nextArrowArea:{
    position:'absolute',
    right:15,
    top:'55%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
  },
  orderImage:{
    width:25,
    height:25
  },
  orderStatusText:{
    fontFamily:'Muli-Bold',
    fontSize:14,
    paddingTop:2,
    paddingHorizontal: 8,
    color:'#434F58'
  },
  orderStatus:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    paddingVertical: 10
  },
  detailOrderText:{
    fontFamily:'Muli-Regular',
    fontSize:15,
    color:'#fff'
  },
  cardBottom:{
    display:'flex',
    alignItems:'flex-start'
  },
  detailOrder:{
    backgroundColor:'#8BC34A',
    width:130,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 5,
    height:35
  },
  cardHeaderText2:{
    fontFamily:'Muli-Regular',
    color:'#304555',
    fontSize:14,
    paddingVertical:5
  },
  cardHeaderText:{
    fontFamily:'Muli-Bold',
    color:'#304555',
    fontSize:16
  },
  cardHeader:{

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
    borderRadius:5,
    marginVertical: 10
  },
  currentOrdersListArea:{
    display:'flex',
    flexDirection:'column',
    //marginVertical:15
  },
  infoText:{
    fontFamily:'Muli-Bold',
    color:'#304555',
    fontSize:18
  },
  infoTextArea:{
    marginTop:10,
    marginBottom:10,
    paddingHorizontal: 5
  },
  currentOrders:{
    display:'flex',
    flexDirection: 'column',
    //marginBottom:20
  },
  orderList:{
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
