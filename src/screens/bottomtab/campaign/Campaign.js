import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  Button,
  ScrollView,
    Animated
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Body, Container, Content, Left, Title} from 'native-base';

import { observer, inject } from 'mobx-react';
import CustomIcon from '../../../font/CustomIcon';
import Spinner from 'react-native-loading-spinner-overlay';
import LoginIMG from '../../../img/login.png';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import API from '../../../api';
import {IMAGE_URL} from 'react-native-dotenv';

import RBSheet from "react-native-raw-bottom-sheet";

import Image_ from '../../../img/up-arrow.png'

import EmptyHeader from '../../components/EmptyHeader';
import EmptyIMG from '../../../img/nocamp.png';

const HEADER_MAX_HEIGHT=55
const HEADER_MIN_HEIGHT=0
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const INPUT_MAX_HEIGHT=28
const INPUT_MIN_HEIGHT=0
const INPUT_SCROLL_DISTANCE = INPUT_MAX_HEIGHT - INPUT_MIN_HEIGHT

@inject('CampaignStore')
@observer
export default class Campaign extends Component {

  state ={
    loading:false,
    campaigns:[],
    fetched:false,
    scrollY:new Animated.Value(0),
    prevY:0
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
                <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack()}>
                  <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                </TouchableOpacity>
              </View>
              <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>Kampanyalar</Title>
              </View>
            </EmptyHeader>

          </Animated.View>

          <Spinner
              visible={this.state.loading}
              animation={'fade'}
              size={'small'}
          />
          <Content
              style={{display:'flex', flex:1, }}

              scrollEventThrottle={16}
              onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
              )}

              bounces={this.state.campaigns.length > 3}


              padder>

            {
              this.props.CampaignStore.getCampaigns.length > 0
                ?
                      this.props.CampaignStore.getCampaigns.map(e => {
                        const uri = IMAGE_URL+e.campaign_image;
                        return <View style={styles.campaignArea} key={e._id} onPress={() => {
                                    if(e.campaign_type == 1){
                                      this[RBSheet + e._id].open()
                                    }
                                  }}>

                          {e.campaign_type == 1
                              ?
                                  <RBSheet
                                      ref={ref => {
                                        this[RBSheet + e._id] = ref;
                                      }}
                                      closeOnPressMask={true}
                                      closeOnPressBack={true}
                                      customStyles={{
                                        draggableIcon: {
                                          backgroundColor: "#304555"
                                        },
                                        container:{
                                          borderTopLeftRadius: 10,
                                          borderTopRightRadius: 10,
                                        }
                                      }}
                                      height={(Dimensions.get('window').height*65)/100}
                                  >

                                      <View style={{paddingHorizontal:15, paddingVertical:15}}>
                                        <Text style={{fontFamily:'Muli-ExtraBold', color:'#304555', fontSize:18, paddingBottom:10}}>Kampanya detayları</Text>
                                        <ScrollView contentContainerStyle={{minHeight:(Dimensions.get('window').height*60)/100}}><Text style={{fontFamily:'Muli-Regular', marginBottom:10, color:'#304555'}}>{e.campaign_desc}</Text></ScrollView>
                                      </View>

                                  </RBSheet>
                              :
                                  <></>
                              }

                              <View style={styles.campaignCard}>
                                <View style={styles.shadowImage}>
                                  <Image
                                      source={{uri: uri}}
                                      style={styles.campaignImage}
                                      resizeMode={'stretch'}
                                  />
                                  {e.campaign_type == 1 &&
                                    <TouchableOpacity
                                        onPress={() => {
                                          this[RBSheet + e._id].open()
                                        }}
                                        style={{shadowColor: "#304555", shadowOffset: {width: 0, height: 0, }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 1, position:'absolute', bottom:5, right:5, width:36, height:36, borderRadius:50, backgroundColor:'#fff', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                      <Image source={Image_} style={{width:18, height:18}} />
                                    </TouchableOpacity>
                                  }
                                </View>
                                <View style={styles.campaingTextArea}>
                                  <Text style={styles.campaignText}>{e.campaign_short_desc}</Text>
                                </View>
                              </View>
                            </View>
                          })
                  :
                  <View style={{display:'flex', height:Dimensions.get('window').height-200, justifyContent:'center', alignItems:'center'}}>
                    <Image source={EmptyIMG} style={{width:80, height:80}}/>
                    <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:20, color:'#304555'}}>Şimdilik kampanya yok</Text>
                    <Text style={{fontFamily:'Muli-SemiBold', marginTop:5, fontSize:15, color:'#304555'}}>kampanya geldiğinde haberdar edeceğiz.</Text>
                  </View>
            }


          </Content>

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
    paddingVertical: 0,
    marginVertical:0
  },
  campaignText:{
    fontFamily: 'Muli-SemiBold',
    color:'#304555',
    fontSize:14
  },
  campaingTextArea:{
    paddingHorizontal:15,
    paddingVertical:10
  },
  shadowImage:{
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 5,
  },
  campaignImage:{
    width:'100%',
    height:172,
    borderRadius: 15,

  },
  campaignCard:{
    width:'100%',
    minHeight:225,
    borderRadius:15,
    backgroundColor:'#fff',
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 5,
    elevation: 5,
    marginBottom:40
  },
  campaignArea:{
    display:'flex',
    justifyContent:'center',
    alignItems: 'center'
  },

});
