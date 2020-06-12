import React, { Component } from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import DialogIMG from '../../img/dialogue.png';

import {inject, observer} from 'mobx-react';

@inject('BranchStore')
@observer

export default class OutOfWork extends Component {
  render() {
    return (
      <View>

          {this.props.BranchStore.branchStatus == false && <View style={{
                      display:'flex',
                      minHeight:40,
                      flexDirection:'row',
                      alignItems:'center',
                      backgroundColor:'rgba(255, 249, 196, 0.4)',
                      paddingHorizontal:10,
                      paddingVertical:8,
                      borderTopWidth:0.2,
                      borderBottomWidth:0.2,
                      borderColor:'#FFC107',
                      width:'100%',
                  }}>
                      <Image source={DialogIMG} style={{width:20, height:20, marginRight:10}}/>
                      <Text style={{width:'90%', fontFamily:'Muli-Regular', color:'#212121'}}>{this.props.BranchStore.branchStatusMessage}</Text>
                  </View>
          }


      </View>
    );
  }
}

const styles = StyleSheet.create({});
