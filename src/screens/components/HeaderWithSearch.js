import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions, SafeAreaView } from 'react-native';
import {Header, Input, Item, Left, Right} from 'native-base';

import InputBg from '../../img/inputbg.png';
import MavidenIsteText from '../../img/mavidenistetext.png';
import CustomIcon from '../../font/CustomIcon';

export default class HeaderWithSearch extends Component {

  state = {
    isSearchClick: false,
    inputAreaWidth: new Animated.Value(1),
    close: new Animated.Value(0)
  }

  _handleSearchClick = () => {
    this.setState({
        isSearchClick: true,
    });

    Animated
        .spring(this.state.inputAreaWidth,{
          toValue:2,
          duration:400
        })
        .start();

    Animated
        .spring(this.state.close, {
          toValue:1,
          duration:400
        }).start()

  }

  _handleSearchBlur = () => {
    this.setState({
      isSearchClick: false,
    });

    Animated
        .timing(this.state.inputAreaWidth,{
          toValue:1,
          duration:400
        })
        .start();

    Animated
        .spring(this.state.close, {
          toValue:0,
          duration:400
        }).start()

  }



  render() {

    let widthValue = 140;
    let searchArea = {};
    let header = {}
    let inputArea = {inputArea}
    let logoArea = {};
    let logo = {};
    let inputBg = {};
    let inputStyle2 = {};
    let outputRange;
    if(this.props.subView == true) {
      outputRange = Dimensions.get('window').width-65;
      widthValue = 130;
      inputStyle2 = {
        marginRight: 20,
        marginLeft: 20,
      }
      searchArea = {

      };
      header = {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginVertical:10,
      }
      inputArea = {
        borderColor:'#fff',
        marginVertical:0,
        height:30,
        width:'100%',
        backgroundColor:'#fff',
        borderRadius:25,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 7,
        elevation: 5,
      }
      logoArea = {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#fff',
        height:30,
        width:130,
        backgroundColor:'#fff',
        borderRadius:25,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 7,
        elevation: 5,
      }
      logo = {
       // marginTop:3
      }
      inputBg = {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
      }
    }else {
      outputRange = Dimensions.get('window').width-18;
      widthValue = 190;
      searchArea = {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
      };
      header =  {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginVertical:10,
      }
      inputArea = {
        borderColor:'#fff',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:30,
        width:'100%',
        backgroundColor:'#fff',
        borderRadius:25,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 7,
        elevation: 5,
      }
      logoArea = {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
      }
      logo = {
        marginTop:3
      },
     inputBg = {
       display:'flex',
       justifyContent:'center',
       alignItems:'center',
       marginTop:5
     }
      inputStyle2 = {
        marginRight: 20,
      }
    }

    const inputWitdhInterpolate = this.state.inputAreaWidth.interpolate({
        inputRange: [1, 2],
        outputRange: [widthValue, outputRange]
    });

    const inputStype = {
      width: inputWitdhInterpolate,
    };



    const animatedClose = {
      opacity: this.state.close
    }


    return (
        <SafeAreaView transparent style={header}>

          {this.props.subView
              ?
              <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack()}>
                <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF'}} />
              </TouchableOpacity>
              :
              <></>
          }

          <View style={searchArea}>
                 <Animated.View style={[inputBg, inputStype, inputStyle2]}>
                   <Item
                       style={inputArea}>
                           <View>
                             <Text style={styles.accIcon}>
                               <CustomIcon
                                   name="Path-222"
                                   size={16}
                                   style={{color: '#616D7B'}}
                               />
                             </Text>
                           </View>
                           <Input
                               style={[styles.input, {zIndex:9}]}
                               placeholder="Arayın"
                               placeholderTextColor={'#CCC7C7'}
                               onChange={this._handleSearchClick}
                               onBlur={this._handleSearchBlur}
                               onFocus={this._handleSearchClick}
                           />
                           <Animated.View style={[animatedClose]}>
                                   <TouchableOpacity style={{marginRight:5}}>
                                     <Text style={styles.accIcon}>
                                       <CustomIcon
                                           name="close"
                                           size={24}
                                           style={{color: '#616D7B'}}
                                       />
                                     </Text>
                                   </TouchableOpacity>
                           </Animated.View>
                      </Item>
                  </Animated.View>
               </View>
               <View style={logoArea}>
                 <Image
                     source={MavidenIsteText}
                     style={logo}
                 />
               </View>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  accIcon:{
    marginLeft: 10,
    marginRight: 5,
    marginTop:1
  },
  input:{
    fontFamily:'Muli-SemiBold',
    fontSize:14,
  },
  headerArea:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
});
