import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomIcon from '../../font/CustomIcon';
import Ripple from 'react-native-material-ripple';
import {inject, observer} from 'mobx-react';
import NavigationService from '../../NavigationService';

@inject('BasketStore', 'ProductStore')
@observer
export default class BasketAmount extends Component {
  render() {
    return (
      <View style={{
          zIndex:9999,
          height:40,
          width:105,


          position:'absolute',
          bottom:16,
          right:4
      }}>
          {
              this.props.BasketStore.getProducts.length > 0 && <Ripple
                  rippleContainerBorderRadius={5}
                  onPress={() => {
                      setTimeout(() => {
                          NavigationService.navigate('ShopingCard')
                      }, 300)

                  }}
                  style={{
                      borderRadius:5,
                  zIndex:9999,
                  height:40,
                  width:100,
                  backgroundColor:'#fff',
                  display:'flex',
                  flexDirection:'row',
                  justifyContent:'space-between',
                  alignItems:'center',
                  shadowColor: "#304555",
                  shadowOffset: {
                      width: 0,
                      height: 1,
                  },
                  shadowOpacity: 0.20,
                  shadowRadius: 2,
                  elevation: 0.5,
                  paddingLeft: 7,

              }}>
                  <CustomIcon  name="shopping-cart-fill" size={25} style={{color: '#003DFF'}}  />
                  <Text style={{fontFamily:'Muli-Regular', marginRight:7}}>{parseFloat(this.props.BasketStore.getTotalPrice).toFixed(2)} <Text style={{fontFamily:'Arial', fontSize:15}}>₺</Text></Text>
              </Ripple>
          }

      </View>
    );
  }
}

const styles = StyleSheet.create({});
