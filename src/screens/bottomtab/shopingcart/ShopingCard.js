import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    Platform,
    Animated,
    FlatList,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import {Container, Header, Left, Body, Right, Button, Title, Content, Card, Input, Item} from 'native-base';
import CustomIcon from '../../../font/CustomIcon';
import FastImage from 'react-native-fast-image';

import {NavigationActions, NavigationEvents} from 'react-navigation';

import {observer, inject} from 'mobx-react';
import {IMAGE_URL} from 'react-native-dotenv';

import EmptyIMG from '../../../img/empty.png'
import RefreshIMG from '../../../img/refresh.png'
import Spinner from 'react-native-loading-spinner-overlay';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BasketStore from '../../../store/BasketStore';
import Ripple from 'react-native-material-ripple';
import API from '../../../api';
import AuthStore from '../../../store/AuthStore';
import EmptyHeader from '../../components/EmptyHeader';
import OutOfWork from '../../components/OutOfWork';
import ProductCard from '../../components/ProductCard';
import RandomProducts from '../../components/RandomProducts';
import RBSheet from 'react-native-raw-bottom-sheet';
import Snackbar from 'react-native-snackbar';
import {check} from 'react-native-permissions';
import ChoiceSavedList from '../../components/ChoiceSavedList';
import EmptyIMG___ from '../../../img/checklist.png';


@inject('BasketStore', 'AuthStore', 'BranchStore', 'ProductStore','ShoppingListStore')
@observer
export default class ShopingCard extends Component {

    state = {
        fetched:false,
        datas:[],
        loading: false,
        totalPrice: 0,
        listName:'',
        loadingList:false,
    }

    componentDidMount = async () => {
        try{
            this.setState({
                loading:true,
            });

            await this.props.BasketStore.readyProducts()

            setTimeout(() => {
                this.setState({
                    loading:false,
                    fetched:true,
                    totalPrice: this.props.BasketStore.totalPrice
                });


            }, 1000)

        }catch(e){
            alert(e)
        }
    }



    _handleBasketRemove = async () => {
        try{
            Alert.alert(
                'Sepeti Temizle',
                'Sepeti temizlemeye emin misiniz?',
                [
                    {
                        text: 'Hayır',
                        style: 'cancel',
                    },
                    {   text: 'Evet',
                        onPress: async () => {
                            this.setState({
                                loading:true,
                            });

                            await this.props.BasketStore.clearBasket()
                            setTimeout(async () => {
                                this.setState({
                                    loading:false,
                                    fetched:true
                                });
                            }, 1000);
                        }
                    },
                ]
            );
        }catch(e){
            alert(e)
        }
    }

    _handleProductRemove = async (id) => {
        try{
            this.setState({
                loading:true,
               // fetched:false
            });

            await this.props.BasketStore.removeFromBasket(id);

            setTimeout(() => {
                this.setState({
                    loading:false,
                 //   fetched:true
                });
            }, 1000)

        }catch(e){
            alert(e);
        }
    }

    _handleProductDecrement = async (id, count) => {
        try{
            if(count > 1) {
                this.setState({
                    loading: true,
                });
                await this.props.BasketStore.decrementProduct(id);
                setTimeout(async () => {

                    this.setState({
                        loading: false,
                        totalPrice: this.props.BasketStore.totalPrice
                    });
                }, 600);
            }
        }catch(e){
            alert(e);
        }
    }

    _handleProductIncrement = async (id) => {
        try{
            this.setState({
                loading:true,
            });
            const increment = await this.props.BasketStore.incrementProduct(id);
            setTimeout(async () => {

                this.setState({
                    loading:false,
                    totalPrice: this.props.BasketStore.totalPrice
                });
            }, 600)
        }catch(e){
            alert(e);
        }
    }

    _handleGoAheadClick = async () => {
        try{
            this.setState({
                loading:true,
            });

            if(this.props.AuthStore.token !== null){
                this.props.navigation.navigate('ApplyOrder')
            }else{
                this.loginMate.open()
                // this.props.navigation.navigate('Profile')
            }

            this.setState({
                loading:false,
            });

        }catch(e){
            console.log(e);
        }
    }

    _handleSaveList = async () => {
        //loginMate
        if(this.props.AuthStore.token !== null) {
            this[RBSheet].open()
        }else{
            this.loginMate.open()
        }
    }

    _handleListSaveBtn = async () => {
      Keyboard.dismiss();
      try{
          if(this.state.loadingList == false) {
              this.setState({
                  loadingList: true,
              });
              if (this.state.listName.trim() == '') {
                  Snackbar.show({
                      text: 'Bir liste ismi girmeniz gerekli',
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: '#aacfcf',
                      textColor: 'white',
                  });
                  setTimeout(() => {
                      this.setState({
                          loadingList: false,
                      });
                  }, 500)
                  return false;
              }

              if(this.state.listName.trim().length < 2){
                  Snackbar.show({
                      text: 'Biraz daha uzun isim yazınız',
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: '#aacfcf',
                      textColor: 'white',
                  });
                  setTimeout(() => {
                      this.setState({
                          loadingList: false,
                      });
                  }, 500)
                  return false;
              }

              if(this.state.listName.trim().length > 25){
                  Snackbar.show({
                      text: 'Biraz daha kısa isim yazınız',
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: '#aacfcf',
                      textColor: 'white',
                  });
                  setTimeout(() => {
                      this.setState({
                          loadingList: false,
                      });
                  }, 500)
                  return false;
              }

              const userID = this.props.AuthStore.getUserID;
              const products = this.props.BasketStore.getProducts;
              const listName = this.state.listName.trim();

              const checkName = await API.post(`/api/user/shoppinglist/check`, {
                  user_id: userID,
                  list_name: listName,
                  products:products
              }, {
                  headers: {
                      'x-access-token': this.props.AuthStore.getToken
                  }
              });

              const checkProducts = await API.post(`/api/user/shoppinglist/check/products`, {
                  user_id: userID,
                  products:products
              }, {
                  headers: {
                      'x-access-token': this.props.AuthStore.getToken
                  }
              });


              if (checkName.data.state.code == 'CS_0') {
                  Snackbar.show({
                      text: checkName.data.data,
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: '#aacfcf',
                      textColor: 'white',
                  });
                  setTimeout(() => {
                      this.setState({
                          loadingList: false,
                      });
                  }, 500)
                  return false
              }

              if(checkProducts.data.state.code == 'CS_2'){
                  Snackbar.show({
                      text: 'Bu ürünlerden oluşan listeniz var',
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: '#aacfcf',
                      textColor: 'white',
                  });
                  setTimeout(() => {
                      this.setState({
                          loadingList: false,
                      });
                  }, 500);
                  return false;
              }

              const saveProducts = await API.post(`/api/user/shoppinglist`, {
                  user_id: userID,
                  list_name: listName,
                  products:products
              }, {
                  headers: {
                      'x-access-token': this.props.AuthStore.getToken
                  }
              });


              if(saveProducts.data.state.code == 'EE_1'){
                  Snackbar.show({
                      text: 'Beklenmedik bir hata oluştu. ESL_EE0',
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: '#aacfcf',
                      textColor: 'white',
                  });
                  setTimeout(() => {
                      this.setState({
                          loadingList: false,
                      });
                  }, 500)
                  return false;
              }

              await this.props.ShoppingListStore.setList(saveProducts.data.data);

              await this.props.BasketStore.setIsBasketSaved(true);

              await this.props.BasketStore.setSelectedListID(saveProducts.data.relevant_id);

              Snackbar.show({
                  text: 'Sepetiniz kaydedildi',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: '#79d70f',
                  textColor: 'white',
              });


              setTimeout(() => {
                  this[RBSheet].close();
                  this.setState({
                      loadingList: false,
                      listName: ''
                  });
              }, 500)
          }


          return true;
      }catch(e){
          Snackbar.show({
              text: 'Üzgünüz, bir hata ile karşılaşıldı.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor:'#ff6363',
              textColor:'white',
          });
          setTimeout(() => {
              this.setState({
                  loadingList: false,
              });
          }, 500);
          return false;
      }

    }

    render () {

    return (
        <SafeAreaView style={styles.container}>

            <EmptyHeader style={{paddingHorizontal:5, paddingVertical:13, display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems: 'center'}}>
                <View style={{marginRight:30,}}>
                    <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack(null)}>
                        <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                    </TouchableOpacity>
                </View>

                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', flex:1, marginRight:6}}>
                    <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>Sepetim</Title>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                        {
                            this.state.fetched
                                ?
                                this.props.BasketStore.getProducts.length == 0
                                    ?

                                    <TouchableOpacity onPress={() => {
                                        this.myShoppingList.open();
                                    }}>
                                        <View style={[styles.removeBox,{width:124}]}>
                                            <Text style={styles.removeBoxText}>Alışveriş listelerim</Text>
                                            <CustomIcon name="star-fill" size={16} color={'#003DFF'} />
                                        </View>
                                    </TouchableOpacity>

                                    :
                                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:154}}>
                                        {
                                            this.props.BasketStore.getIsBasketSaved
                                                ?

                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if(this.savedList != null)
                                                                this.savedList.open()
                                                        }}
                                                        style={[styles.removeBox2, {display:'flex', flexDirection:'row', justifyContent:'flex-end'}]}>

                                                        <View style={{
                                                            backgroundColor:'#003DFF',

                                                            display:'flex',
                                                            flexDirection:'row',
                                                            justifyContent:'center',
                                                            alignItems:'center',
                                                            borderColor:'#fff',
                                                            width:30,
                                                            height:28,
                                                            borderRadius:5,
                                                            shadowColor: "#000000",
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 0,
                                                            },
                                                            shadowOpacity: 0.10,
                                                            shadowRadius: 5,
                                                            elevation: 1,

                                                        }}>
                                                            <CustomIcon name="star-fill" size={16} color={'#fff'} />
                                                        </View>

                                                    </TouchableOpacity>

                                                : <TouchableOpacity onPress={() => this._handleSaveList()}>
                                                    <View style={styles.removeBox}>
                                                        <Text style={styles.removeBoxText}>Kaydet</Text>
                                                        <CustomIcon name="star-fill" size={16} color={'#003DFF'} />
                                                    </View>
                                                </TouchableOpacity>
                                        }


                                        <TouchableOpacity onPress={() => this._handleBasketRemove()}>
                                            <View style={styles.removeBox}>
                                            <Text style={styles.removeBoxText}>Boşalt</Text>
                                            <CustomIcon name="trash" size={16} color={'#FF0000'} style={{marginTop:1}} />
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                :
                                <></>
                        }
                    </View>
                </View>
            </EmptyHeader>

            <OutOfWork />
          <Content
             style={{display:'flex', flex:1,  marginBottom:-30}}

             scrollEventThrottle={16}
             onScroll={Animated.event(
                 [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
             )}

             bounces={this.props.BasketStore.getProducts.length > 3}


             padder>
              <Spinner
                  visible={this.state.loading}
                  animation={'fade'}
                  size={'small'}
              />

              <View style={[styles.basketArea]}>

                  {
                      this.state.fetched
                          ?
                          this.props.BasketStore.getProducts.length == 0
                              ?
                              <View style={{display:'flex', height:Dimensions.get('window').height-120, justifyContent:'center', alignItems:'center'}}>
                                  <Image source={EmptyIMG} style={{width:80, height:80}}/>
                                  <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:20, color:'#304555'}}>Hiç ürün yok</Text>
                                  <Text style={{fontFamily:'Muli-SemiBold', marginTop:5, fontSize:15, color:'#304555'}}>maviden iste, ayağına gelsin</Text>
                                  <RandomProducts />
                              </View>
                              :
                              this.props.BasketStore.getProducts.map(e => {
                                  const uri = IMAGE_URL+e.product_image;
                                  return <View key={e.id} style={styles.basket}>
                                      <View style={styles.imageArea}>
                                          <FastImage
                                              source={{uri : uri}}
                                              style={styles.image}
                                              resizeMode={FastImage.resizeMode.contain}
                                          />
                                      </View>
                                      <View style={styles.infoArea}>
                                          <View style={styles.infoHead}>
                                              <Text style={styles.infoProductNameText}>{e.product_name}</Text>
                                              <TouchableOpacity onPress={() => this._handleProductRemove(e.id)}>
                                                  <CustomIcon name="trash" size={20} color={'#FF0000'} />
                                              </TouchableOpacity>
                                          </View>
                                          <View style={styles.infoBottom}>
                                              <View style={styles.priceArea}>
                                                  <Text style={styles.priceAreaText}>
                                                      {e.product_discount == null ? e.product_list_price : e.product_discount_price} <Text style={{fontFamily:'Arial', fontSize:12}}>₺</Text></Text>
                                              </View>
                                              <View style={styles.priceCountArea}>
                                                  <TouchableOpacity style={{height:45, width:35, display:'flex', justifyContent:'center', alignItems:'center'}} onPress={() => this._handleProductDecrement(e.id, e.count)}>
                                                      <Text style={{fontFamily:'Muli-SemiBold', fontSize:29, color:'#304555'}}>-</Text>
                                                  </TouchableOpacity>
                                                  <View style={styles.count}>
                                                      <Text style={{fontFamily:'Muli-Bold',  color:'#fff'}}>{e.count}</Text>
                                                  </View>
                                                  <TouchableOpacity style={{height:45, width:35, display:'flex', justifyContent:'center', alignItems:'center'}} onPress={() => this._handleProductIncrement(e.id)}>
                                                      <Text style={{fontFamily:'Muli-SemiBold', fontSize:29, color:'#304555'}}>+</Text>
                                                  </TouchableOpacity>
                                              </View>
                                          </View>
                                      </View>
                                  </View>
                              })
                          :
                          <></>

                  }

              </View>

              {
                  this.state.fetched
                      ?
                      this.props.BasketStore.getProducts.length == 0
                          ?
                          <></>
                          :
                              this.props.BranchStore.branchStatus == true ? <View style={styles.actionArea}>
                                  <Ripple  rippleDuration={1000} rippleColor={'#000'} style={{width:'55%'}} onPress={() => this.props.navigation.navigate('Feed')}>
                                      <View style={styles.resumeShopingBtn}>
                                          <Text style={styles.actionText}>Alışverişe devam</Text>
                                      </View>
                                  </Ripple>

                                  <View style={{width:'32%'}}>
                                      <Text style={styles.resultCountPrice}>{parseFloat(this.props.BasketStore.getTotalPrice).toFixed(2)} <Text style={{fontFamily:'Arial', fontSize:19}}>₺</Text></Text>
                                      <Ripple  onPress={this._handleGoAheadClick} rippleDuration={1000} rippleColor={'#fff'}>
                                          <View style={styles.paymentBtn}>
                                              <Text style={styles.actionText}>Onayla</Text>
                                          </View>
                                      </Ripple>
                                  </View>
                              </View>
                                  : <></>



                      :
                      <></>
              }

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










              <RBSheet
                  ref={ref => {
                      this[RBSheet] = ref;
                  }}
                  closeOnDragDown={true}
                  closeOnPressBack={true}
                  openDuration={250}
                  animationType={'fade'}
                  height={170}
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
                      <Text style={{fontFamily:'Muli-Bold', fontSize:16, textAlign:'center'}}>Sepeti kaydet</Text>

                      <View style={{
                          display:'flex',
                          flexDirection:'column',
                          alignItems:'center',
                          justifyContent:'center',
                          width:'100%',
                          marginVertical:20
                      }}>

                          <Item
                              style={styles.inputArea}>

                              <View style={{paddingLeft:10}}>
                                  <Text style={styles.accIcon}>
                                      <CustomIcon
                                          name="star-fill"
                                          size={18}
                                          style={{color: '#616D7B'}}
                                      />
                                  </Text>
                              </View>

                              <Input
                                  style={[styles.input, {zIndex:9}]}
                                  placeholder={'Liste ismi'}
                                  placeholderTextColor={'#bdbdbd'}
                                  onChangeText={(val) => {
                                      this.setState({
                                          listName: val,
                                      });
                                  }}
                                  value={this.state.listName}
                              />
                          </Item>

                          <View style={{marginTop:22, width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>

                              <Ripple
                                  rippleCentered={true}
                                  rippleContainerBorderRadius={2}
                                  rippleOpacity={0.1}
                                  rippleDuration={500}
                                  onPress={() => {
                                      this.setState({
                                          listName:'',
                                      });

                                      setTimeout(() => {
                                          this[RBSheet].close()
                                      },200)
                                  }}
                                  style={[styles.dotChoice, {backgroundColor:'#fff', borderWidth:1, borderColor:'#B2EBF2'}]}>
                                  <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Vazgeç</Text>
                              </Ripple>

                              <Ripple
                                  rippleCentered={true}
                                  rippleContainerBorderRadius={2}
                                  rippleOpacity={0.1}
                                  rippleDuration={500}
                                  style={styles.dotChoice}
                                  onPress={this._handleListSaveBtn}
                              >
                                  {this.state.loadingList == true ? <ActivityIndicator /> : <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Kaydet</Text>}
                              </Ripple>

                          </View>

                      </View>


                  </View>


              </RBSheet>


              <RBSheet
                  ref={ref => {
                      this.savedList = ref;
                  }}
                  closeOnDragDown={true}
                  closeOnPressBack={true}
                  openDuration={250}
                  animationType={'fade'}
                  height={110}
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
                      <Text style={{fontFamily:'Muli-Bold', fontSize:16, textAlign:'center'}}>{
                          (this.props.BasketStore.isBasketSaved == true && this.props.BasketStore.getSelectedListID != null) && this.props.ShoppingListStore.getShoppingList.filter(e => e._id == this.props.BasketStore.getSelectedListID)[0].list_name
                      }</Text>

                      <View style={{
                          display:'flex',
                          flexDirection:'column',
                          alignItems:'center',
                          justifyContent:'center',
                          width:'100%',
                       //   marginVertical:20
                      }}>



                          <View style={{marginTop:12, width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>

                              <Ripple
                                  rippleCentered={true}
                                  rippleContainerBorderRadius={2}
                                  rippleOpacity={0.1}
                                  rippleDuration={500}
                                  onPress={async () => {
                                      this.setState({
                                          loading: true,
                                      });
                                      this.savedList.close();
                                      this.setState({
                                          loading:false,
                                      });
                                      await this.props.BasketStore.setIsBasketSaved(false);
                                      await this.props.BasketStore.setSelectedListID(null);


                                  }}
                                  style={[styles.dotChoice, {backgroundColor:'#fff', borderWidth:1, borderColor:'#B2EBF2'}]}>
                                  <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Kullanma</Text>
                              </Ripple>

                              <Ripple
                                  rippleCentered={true}
                                  rippleContainerBorderRadius={2}
                                  rippleOpacity={0.1}
                                  rippleDuration={500}
                                  style={styles.dotChoice}
                                  onPress={() => {
                                      this.savedList.close();
                                      this.props.navigation.navigate('ShoppingList');
                                  }}
                              >
                                  <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>{this.state.loadingList == true ? <ActivityIndicator /> : 'Düzenle'}</Text>
                              </Ripple>

                          </View>

                      </View>


                  </View>


              </RBSheet>


              <RBSheet
                  ref={ref => {
                      this.myShoppingList = ref;
                  }}
                  closeOnDragDown={true}
                  closeOnPressBack={true}
                  openDuration={250}
                  animationType={'fade'}
                  height={240}
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
                          borderTopRightRadius:18,
                          display:'flex',
                      }
                  }}

              >

                  <View style={{marginBottom:10, height:20, display:'flex', justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontFamily:'Muli-Bold', fontSize:16, textAlign:'center'}}>Alışveriş listelerim</Text>

                  </View>
                  <View style={{width:'100%'}}>


                      <View style={{
                          display:'flex',
                          flexDirection:'column',
                          alignItems:'flex-start',
                          justifyContent:'center',
                          width:'100%',
                          //   marginVertical:20
                      }}>

                          {


                                    <FlatList
                                            data={this.props.ShoppingListStore.getShoppingList}
                                            renderItem={({item}) => <ChoiceSavedList item={item} rbmanage={this.myShoppingList}  />}
                                            contentContainerStyle={{
                                               // marginVertical:10,

                                            }}
                                            ListFooterComponent={() => <View style={{height:60}}></View>}
                                            keyExtractor={item => item._id}
                                            ListEmptyComponent={() => (
                                                <View style={{display:'flex',marginLeft:'41%',marginTop:15, height:150, justifyContent:'center', alignItems:'center'}}>
                                                    <Image source={EmptyIMG___} style={{width:70, height:70}}/>
                                                    <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:13, color:'#304555'}}>Kayıtlı listen yok</Text>

                                                </View>
                                            )}
                                        />



                          }

                      </View>


                  </View>


              </RBSheet>

          </Content>

        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    dotChoice:{
        borderRadius:2,
        backgroundColor:'#B2EBF2',
        height:35,
        width:'45%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    input:{
        fontFamily:'Muli-SemiBold',
        fontSize:13,
        paddingLeft:10,
    },
    inputArea:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:35,
        width:'100%',
        backgroundColor:'#f4f6ff',
        borderRadius:8,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 0.5,
    },
    header:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        height:Platform.OS == 'ios' ? 70 : 50,
        paddingLeft:10,
        paddingRight:10,
    },
    resultCountPrice:{
      position:'absolute',
        top:-35,
        right:5,
        fontFamily:'Muli-Light',
        color:'#304555',
        fontSize:22
    },
    paymentBtn:{
        backgroundColor:'#003DFF',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:38,
        borderRadius:12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 1,
    },
    actionText:{
        fontFamily:'Muli-Bold',
        color:'#fff',
        fontSize:18
    },
    resumeShopingBtn:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#1BD4FE',
        width:'100%',
        height:38,
        borderRadius:12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 1,
    },
    actionArea:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
        width:'100%',
        marginTop:52,
        paddingBottom:35
    },
    basketArea:{
       // minHeight:'80%'
    },
    count:{
        width:23,
        height:23,
        backgroundColor:'#00CFFF',
        borderRadius:3,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:5
    },
    priceCountArea:{
      display:'flex',
        flexDirection:'row',
      justifyContent:'space-between',
        alignItems:'center',
        width:'55%'
    },
    priceAreaText:{
        fontFamily:'Muli-Bold',
        color:'#fff',
        fontSize:13
    },
    priceArea:{
        backgroundColor:'#003DFF',
        width:'40%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:25,
        borderRadius:8,
        marginTop:5
    },
    infoBottom:{
      display:'flex',
        width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
        alignItems:'center'
    },
    infoProductNameText:{
        width:'85%',
      fontFamily:'Muli-Bold',
        color:'#304555',
        fontSize:11,
    },
    infoHead:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between'
    },
    infoArea:{
        width:'48%',
        padding:10,
        display:'flex',
        justifyContent:'space-between'
    },
    image:{
      height:139,
      borderRadius:15
    },
    imageArea:{
      width:'52%'
    },
    basket:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        height:139,
        backgroundColor:'#fff',
        borderRadius:15,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 1,
        marginBottom:30
    },
    removeBoxText:{
        fontFamily:'Muli-Bold',
        color:'#304555',
        fontSize:10,
        textAlign:'left',
        marginLeft: 10
    },
    removeBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderColor:'#fff',
        paddingRight: 6,
        width:71,
        height:28,
        backgroundColor:'#fff',
        borderRadius:5,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.10,
        shadowRadius: 5,
        elevation: 1,
    },
    removeBox2:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:71,
        height:28,
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
    body:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        maxWidth:'22%'
    }
});
