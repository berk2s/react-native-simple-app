import React, { Component } from 'react';
import {Alert, BackHandler, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Body, Container, Content, Header, Left, Title} from 'native-base';
import CustomIcon from '../../../font/CustomIcon';

import LoginIMG from '../../../img/login.png';
import {inject, observer} from 'mobx-react';

import BakeryIMG from '../../../img/bakery.png'
import FishIMG from '../../../img/fish.png'
import CheeseIMG from '../../../img/cheese.png'
import FruitIMG from '../../../img/fruit.png'
import MilkIMG from '../../../img/milk.png'
import VegetableIMG from '../../../img/vegetable.png'
import LogoIMG from '../../../img/logo.png'
import Spinner from 'react-native-loading-spinner-overlay';


import Swiper from 'react-native-swiper'
import Ripple from 'react-native-material-ripple';
import Modal, {ModalContent} from 'react-native-modals';
import Coupon from '../shopingcart/apply_order/coupon/Coupon';
import BranchIMG from '../../../img/supermarket.png';


import Snackbar from 'react-native-snackbar';
import API from '../../../api';
import EmptyHeader from '../../components/EmptyHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

import BagelImg from '../../../img/currier/bagel.png'
import PastaImg from '../../../img/currier/cake.png'
import ScaleImg from '../../../img/currier/scale.png'
import PharmacyImg from '../../../img/currier/pharmacy.png'
import Kargomg from '../../../img/currier/truck.png'
import Cosmetic from '../../../img/currier/eye-makeup.png'
import Soup from '../../../img/currier/soup.png'
import Coffe from '../../../img/currier/food.png'
import Burger from '../../../img/currier/burguer.png'
import Pizza from '../../../img/currier/pizza.png'
import Kebab from '../../../img/currier/kebab.png'
import Waffle from '../../../img/currier/waffles.png'
import Comp from '../../../img/currier/laptop.png'
import Adapter from '../../../img/currier/adapter.png'
import Cablo from '../../../img/currier/hdmi-cable.png'
import Silicon from '../../../img/currier/silicone.png'
import Terzi from '../../../img/currier/sew.png'
import Petshop from '../../../img/currier/petshop.png'
import Vitamin from '../../../img/currier/vitamins.png'
import Sports from '../../../img/currier/sports.png'
import Sexual from '../../../img/currier/sex.png'
import Tahta from '../../../img/currier/clean.png'
import Evesya from '../../../img/currier/evesya.png'
import Belge from '../../../img/currier/belge.png'
import Doc from '../../../img/currier/doc.png'
import OutOfWork from '../../components/OutOfWork';
import RBSheet from 'react-native-raw-bottom-sheet';
import AddressStore from '../../../store/AddressStore';
import LocationIMG from '../../../img/location.png';
import AuthStore from '../../../store/AuthStore';
import LocationAPI from '../../../locationapi';

@inject('AddressStore', 'AuthStore', 'BranchStore')
@observer
export default class Currier extends Component {

  state={
    loading:false,
    visibleAddress:false,
    addressid:null
  }

  _handlePress = () => {

    if(this.props.AuthStore.getUserID == null){

      this.loginMate.open();

      return false;
    }

    if(this.props.BranchStore.branchStatus == false){
      Snackbar.show({
        text: this.props.BranchStore.branchStatusMessage,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor:'#AFB42B',
        textColor:'white',
      });

      return false
    }

    this.selectAdress.open()

  }

  _handleAddressPress = async (e) => {
    this.setState({
      addressid:e,
    });

    this.selectAdress.close();


  }

  _handleOrderApply = async () => {
    try{



            const sendOrder = await API.post('/api/orders', {
              user_id: this.props.AuthStore.getUserID,
              user_address: this.state.addressid,
              payload_type: null,
              products: null,
              price: null,
              order_note: null,
              is_bluecurrier: true,
              coupon: null,
              branch_id:this.props.BranchStore.branchID,
            }, {
              headers:{
                'x-access-token': this.props.AuthStore.getToken
              }
            });

            if(sendOrder.data.status.code == 'IO_0'){
              Snackbar.show({
                text: sendOrder.data.data,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#AFB42B',
                textColor:'white',
              });
            }else if(sendOrder.data.status.code == 'IO_E'){
              Snackbar.show({
                text: sendOrder.data.data,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#AFB42B',
                textColor:'white',
              });
            }else if(sendOrder.data.status.code == 'IO_1'){
              Snackbar.show({
                text: 'İstekleriniz için sizi az sonra arayacağız',
                duration: 7000,
                backgroundColor:'#4CAF50',
                textColor:'white',
              });
            }

            this.setState({
              loading:false,
              visibleAddress:false,
              addressid:null
            });



    }catch(e){


        Snackbar.show({
          text: 'Üzgünüz, bir hata ile karşılaşıldı.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor:'#ff6363',
          textColor:'white',
        });
        this.setState({
          loading:false,
        });
        return false;



    }

  }




  render() {
    return (
        <SafeAreaView style={[styles.container, {backgroundColor:'#F6F6F6', flex:1}]}>

          <EmptyHeader>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1}}>
              <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>
                <Text style={{textAlign:'center'}}>
                  <Text style={{color:'#003DFF'}}>mavi</Text><Text style={{color:'#00CFFF'}}>kurye</Text>
                </Text>
              </Title>
            </View>
          </EmptyHeader>
          <OutOfWork />

          <Content
              style={{display:'flex', flex:1,}}
              padder>


            <View style={{display:'flex', justifyContent:'center', alignItems: 'center'}}>
            <Swiper autoplay={true} autoplayTimeout={2.5} showsPagination={true} style={{height:320}}>
              <View style={styles.circleArea}>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                      source={BagelImg}
                      style={{width:50, height:50}}
                      />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Taze sıcak</Text>
                </View>

                <View style={styles.circleTop}>
                      <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                        <Image
                          source={PastaImg}
                          style={{width:50, height:50}}
                        />
                      </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Pasta</Text>
                </View>

                <View style={styles.circleTop}>
                    <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                      <Image
                          source={ScaleImg}
                          style={{width:50, height:50}}
                      />
                    </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Kasap</Text>
                </View>

                <View style={styles.circleTop}>
                    <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                      <Image
                          source={PharmacyImg}
                          style={{width:50, height:50}}
                      />
                    </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Eczane</Text>
                </View>

                <View style={styles.circleTop}>
                      <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                        <Image
                            source={Kargomg}
                            style={{width:50, height:50}}
                        />
                      </Ripple>
                    <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Kargo</Text>
                </View>

                <View style={styles.circleTop}>
                    <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                      <Image
                          source={Cosmetic}
                          style={{width:50, height:50}}
                      />
                    </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Kozmetik</Text>
                </View>

              </View>

              <View style={styles.circleArea}>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Soup}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Çorba</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Coffe}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Kahve</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Burger}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Hamburger</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Pizza}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Pizza</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Kebab}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Dürüm</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Waffle}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Waffle</Text>
                </View>

              </View>

              <View style={styles.circleArea}>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Comp}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Bilgisayar</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Adapter}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', width:'100%',color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Telefon</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Cablo}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Kablo</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Silicon}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Nalbur</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Terzi}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Terzi</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Petshop}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Petshop</Text>
                </View>

              </View>

              <View style={styles.circleArea}>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Vitamin}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Sağlık</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Sports}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Sporcu gıdası</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Sexual}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Cinsel ürünler</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Tahta}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Tahtakale</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Belge}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Belge</Text>
                </View>

                <View style={styles.circleTop}>
                  <Ripple rippleContainerBorderRadius={50} style={styles.circle} onPress={this._handlePress}>
                    <Image
                        source={Doc}
                        style={{width:50, height:50}}
                    />
                  </Ripple>
                  <Text style={{fontFamily: 'Muli-ExtraBold', color:'#304555', fontSize:15, textAlign:'center', marginTop:7}}>Doküman</Text>
                </View>

              </View>

            </Swiper>
            </View>

            <View style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:-5}}>

              <View>
                <View style={{display:'flex', justifyContent:'center',alignItems: 'center'}}>

                  <Text style={{fontFamily: 'Muli-Regular', color:'#00CFFF', textAlign:'center', width:300,}}>Kurye istekleriniz için yukarıdan seçebilir</Text>
                  <Text style={{fontFamily: 'Muli-Bold', color:'#00CFFF', textAlign:'center', width:300,}}>veya</Text>
                  <Text style={{fontFamily: 'Muli-Regular', color:'#00CFFF', textAlign:'center', width:300, marginBottom:20}}>özel istekleriniz için butona basabilirsiniz</Text>

                  <TouchableOpacity onPress={this._handlePress} style={{opacity:this.props.BranchStore.branchStatus == true ? 1 : 0.4}}>
                    <Image
                        source={LogoIMG}
                        style={{width:99, height:92}}
                      />
                  </TouchableOpacity>
                </View>
              </View>

            </View>

          </Content>


          <RBSheet
              ref={ref => {
                this.confirmOrder = ref;
              }}
              closeOnDragDown={true}
              closeOnPressBack={true}
              openDuration={250}
              animationType={'fade'}
              height={125}
              customStyles={{
                wrapper:{
                  zIndex:1,
                },
                draggableIcon: {
                  backgroundColor: "#304555"
                },
                container:{
                  paddingHorizontal:15,
                  backgroundColor:'#fff',
                  borderTopLeftRadius:18,
                  borderTopRightRadius:18
                }
              }}

          >
            <Spinner
                visible={this.state.loading}
                animation={'fade'}
                size={'small'}
            />

            <View>
              <Text style={{fontFamily:'Muli-Bold', fontSize:16, textAlign:'center'}}>Kurye talebinizi onaylıyor musunuz?</Text>

              <View style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                width:'100%',
                marginBottom:10
              }}>

                <View style={{marginTop:20, width:'100%', display:'flex', flexDirection:'row',justifyContent:'space-between', alignItems:'center' }}>

                  <Ripple
                      rippleCentered={true}
                      rippleContainerBorderRadius={2}
                      rippleOpacity={0.1}
                      rippleDuration={500}
                      style={[styles.dotChoice, {backgroundColor:'#fff', borderWidth:1, borderColor:'#B2EBF2'}]}
                      onPress={async () => {
                        this.confirmOrder.close();
                      }}
                  >
                    <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Vazgeç</Text>
                  </Ripple>

                  <Ripple
                      rippleCentered={true}
                      rippleContainerBorderRadius={2}
                      rippleOpacity={0.1}
                      rippleDuration={500}
                      style={styles.dotChoice}
                      onPress={async () => {
                        this.confirmOrder.close();
                        await this._handleOrderApply();
                      }}
                  >
                    <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Evet</Text>
                  </Ripple>

                </View>

              </View>


            </View>


          </RBSheet>
































          <RBSheet
              ref={ref => {
                this.selectAdress = ref;
              }}
              onClose={() => {
                if(this.state.addressid != null) {
                    this.confirmOrder.open()
                }
              }}
              closeOnDragDown={true}
              closeOnPressBack={true}
              openDuration={250}
              animationType={'fade'}
              height={225}
              customStyles={{
                wrapper:{
                  zIndex:1,
                },
                draggableIcon: {
                  backgroundColor: "#304555"
                },
                container:{
                  //  paddingHorizontal:20,
                  backgroundColor:'#fff',
                  borderTopLeftRadius:18,
                  borderTopRightRadius:18
                }
              }}

          >

            <Spinner
                visible={this.state.loading}
                animation={'fade'}
                size={'small'}
            />
            <View>
              <Text style={{fontFamily:'Muli-Bold', fontSize:16, textAlign:'center'}}>Adres seçin</Text>

              <View style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                width:'100%',
                marginBottom:10
              }}>

                <View style={{marginTop:2, width:'100%', display:'flex', flexDirection:'column', }}>

                  {
                    AddressStore.getAddress.length > 0
                        ?
                        AddressStore.getAddress.map(e => {
                          return <Ripple
                              key={e._id}
                              style={[styles.selectAddressMap, {paddingHorizontal:15, display:'flex', flexDirection:'row', justifyContent:'flex-start',}]}
                              onPress={() => this._handleAddressPress(e)}>
                            <Image source={LocationIMG} style={{width:17, height:17}}/>
                            <Text style={[styles.selectAddressTitle, {paddingHorizontal:10}]}>{e.address_title}</Text>
                          </Ripple> })
                        :  <View style={{display:'flex', height:150, justifyContent:'center', alignItems:'center'}}>

                          <Text style={{fontFamily:'Muli-Regular', color:'#304555', fontSize:14, textAlign:'center'}}>Hiç adresin yok{'\n'}devam etmek için adres gerekli</Text>

                          <Ripple
                              rippleCentered={true}
                              rippleContainerBorderRadius={2}
                              rippleOpacity={0.1}
                              rippleDuration={500}
                              style={[styles.dotChoice, {marginTop:20}]}
                              onPress={async () => {
                                try{
                                  this.setState({
                                    loading:true,
                                  });
                                  //await AuthStore.deleteUser();

                                  const address = await API.get(`/api/user/address/${AuthStore.getUserID}`, {
                                    headers:{
                                      'x-access-token': AuthStore.getToken
                                    }
                                  });

                                  const datas = await LocationAPI.get('/api/location/province');

                                  this.props.navigation.navigate('AddressManagement', {address: address.data.data, provinces:datas.data})


                                }catch(e){
                                  Snackbar.show({
                                    text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                                    duration: Snackbar.LENGTH_LONG,
                                    backgroundColor:'#ff6363',
                                    textColor:'white',
                                  });
                                  return false;
                                }

                                this.setState({
                                  loading:false,
                                });
                                this.selectAdress.close()


                              }}
                          >
                            <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Adres ekle</Text>
                          </Ripple>

                        </View>

                  }

                </View>

              </View>


            </View>


          </RBSheet>















          <RBSheet
              ref={ref => {
                this.loginMate = ref;
              }}
              closeOnDragDown={true}
              closeOnPressBack={true}
              openDuration={250}
              animationType={'fade'}
              height={120}
              customStyles={{
                wrapper:{
                  zIndex:1,
                },
                draggableIcon: {
                  backgroundColor: "#304555"
                },
                container:{
                  paddingHorizontal:20,
                  backgroundColor:'#fff',
                  borderTopLeftRadius:18,
                  borderTopRightRadius:18
                }
              }}

          >


            <View>
              <Text style={{fontFamily:'Muli-Bold', fontSize:16, textAlign:'center'}}>Devam etmek için</Text>

              <View style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                width:'100%',
                marginVertical:20
              }}>

                <View style={{marginTop:2, width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>

                  <Ripple
                      rippleCentered={true}
                      rippleContainerBorderRadius={2}
                      rippleOpacity={0.1}
                      rippleDuration={500}
                      onPress={() => {
                        this.props.navigation.navigate('Register');
                        setTimeout(() => {
                          this.loginMate.close()
                        }, 100);
                      }}
                      style={[styles.dotChoice, {backgroundColor:'#fff', borderWidth:1, borderColor:'#B2EBF2'}]}>
                    <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Kaydol</Text>
                  </Ripple>

                  <Ripple
                      rippleCentered={true}
                      rippleContainerBorderRadius={2}
                      rippleOpacity={0.1}
                      rippleDuration={500}
                      style={styles.dotChoice}
                      onPress={() => {
                        this.props.navigation.navigate('Login');
                        setTimeout(() => {
                          this.loginMate.close()
                        }, 100);
                      }}
                  >
                    <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Giriş yap</Text>
                  </Ripple>

                </View>

              </View>


            </View>


          </RBSheet>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  selectAddressMap:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    height:35,
    marginBottom:10
  },
  dotChoice:{
    borderRadius:2,
    backgroundColor:'#B2EBF2',
    height:35,
    width:'45%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  circleTop:{
    marginBottom:50,
    width:'33%',
    display:'flex',
    justifyContent:'center',
    alignItems: 'center'
  },
  circle:{
    width:82,
    height:82,
    borderRadius:50,
    borderColor:'#003DFF',
    borderWidth:1,
    display:'flex',
    justifyContent: 'center',
    alignItems:'center',
  },
  circleArea:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    flexWrap:'wrap',
    height:300
  },
  bodyTitleText:{
    fontFamily:'Muli-ExtraBold',
    color:'#003DFF'
  }
});
