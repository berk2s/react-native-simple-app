import React, { Component } from 'react';
import {StyleSheet, Text, View, Dimensions, Animated, Easing, SafeAreaView, Platform, Linking} from 'react-native';

import Loading2 from '../components/Loading2';

import {observer, inject} from 'mobx-react';

import VersionStore from '../../store/VersionStore';
import BranchStore from '../../store/BranchStore';
import ProductStore from '../../store/ProductStore';
import NewsStore from '../../store/NewsStore';
import CampaignStore from '../../store/CampaignStore';
import CategoryStore from '../../store/CategoryStore';
import BasketStore from '../../store/BasketStore';
import AuthStore from '../../store/AuthStore';
import Snackbar from 'react-native-snackbar';
import NetInfo from '@react-native-community/netinfo';

import Modal, {ModalContent} from 'react-native-modals';
import {Button} from "native-base";

import AsyncStorage from '@react-native-community/async-storage';

@observer
export default class AuthSwitcher extends Component {

    state = {
        width: new Animated.Value(0),
        visibleUpdate:false
    }


    componentDidMount = async () => {
        try {
            const netStatus = await NetInfo.fetch();

            if(!netStatus.isConnected) {

                Snackbar.show({
                    text: 'İnternet bağlantınız yok',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: '#aacfcf',
                    textColor: 'white',
                });

                return false;
            }

            await VersionStore.checkVersion();

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*2,
                userNativeDriver: true,
            }).start();

            if(parseFloat(VersionStore.getDeviceVersion) !== parseFloat(VersionStore.getLastVersion)){
                if(VersionStore.getOnProduction === 1) {
                    this.setState({
                        visibleUpdate: true,
                    });
                    Animated.spring(this.state.width, {
                        toValue: (Dimensions.get('window').width / 10) * 10,
                        userNativeDriver: true,
                    }).start();
                    return false;
                }
            }



            const isUpdated = await AsyncStorage.getItem('isUpdated');

            if(isUpdated == null){

                const isAuthenticated = await AuthStore.isAuthenticated();

                if(isAuthenticated) {
                    await AsyncStorage.setItem('isUpdated', JSON.stringify(true))
                    await AuthStore.deleteUserOnce()
                }

            }

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*1,
                userNativeDriver: true,
            }).start();

            await BranchStore.checkBranchExists();

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*1,
                userNativeDriver: true,
            }).start();

            await BranchStore.fetchBranchList();

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*3,
                userNativeDriver: true,
            }).start();

            await ProductStore.fetchProducts(BranchStore.branchID);

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*4,
                userNativeDriver: true,
            }).start();

            await NewsStore.fetchNews(BranchStore.branchID);

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*5,
                userNativeDriver: true,
            }).start();

            await CampaignStore.fetchCampaigns(BranchStore.branchID);

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*6,
                userNativeDriver: true,
            }).start();

            await CategoryStore.fetchCategories();

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*7,
                userNativeDriver: true,
            }).start();

            await BasketStore.readyProducts();

            Animated.spring(this.state.width, {
                toValue: (Dimensions.get('window').width/10)*9,
                userNativeDriver: true,
            }).start();

            await AuthStore.authSync();


        }catch(e){
            console.log(e)
        }
    }

    render() {
    return (
      <SafeAreaView style={{backgroundColor:'#F6F6F6', display:'flex', justifyContent:'center', alignItems:'center', }}>

          <Modal
              visible={this.state.visibleUpdate}
              animationType="slide"
              onHardwareBackPress={() => {
                  if(VersionStore.getIsRequired == 0) {
                      this.setState({visibleUpdate: false});
                  }
              }}
              onTouchOutside={(event) => {
                  if(VersionStore.getIsRequired == 0) {
                      this.setState({visibleUpdate: false});
                  }
              }}
          >
              <ModalContent style={{width:270, height:200, paddingTop:0, display:'flex', justifyContent:'space-between',}}>
                  <View style={{display:'flex', justifyContent:'space-between', paddingVertical:10, height:205,}}>

                      <Text style={{fontFamily:'Muli-Bold', fontSize:18, color:'#30455'}}>
                          Yeni bir güncellememiz var
                      </Text>

                      <Text style={{fontFamily:'Muli-Regular', fontSize:14, color:'#30455', marginTop:5}}>
                          Yazdığınız geri dönüşlerden yola çıkarak iyileştirmeler yaptık.
                      </Text>

                      <Text style={{fontFamily:'Muli-Regular', fontSize:14, color:'#30455', marginTop:5}}>
                          Size daha iyi hizmet verebilmek için lütfen güncelleyin
                      </Text>

                      <Button
                          onPress={() => {
                              if(Platform.OS === 'android'){
                                  Linking.openURL(VersionStore.getPlayStoreLink)
                              }else{
                                  Linking.openURL(VersionStore.getAppStoreLink)
                              }
                          }}
                          style={{borderRadius:8, marginTop:20, marginBottom:10, height:38, backgroundColor:'#7FB7EA', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>

                          <Text style={{color:'#fff', fontFamily:'Muli-ExtraBold'}}>Şimdi güncelle</Text>

                      </Button>

                  </View>
              </ModalContent>
          </Modal>

          <Loading2 />

          <View style={{position:'absolute', bottom:0, width:'100%', height:5, }}>
              <Animated.View style={{backgroundColor:'#00CFFF', width:this.state.width, height:5}}></Animated.View>
          </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
