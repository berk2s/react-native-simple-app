import React, { Component } from 'react';
import {StyleSheet, Text, View, Animated, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import {Input, Item, Header} from 'native-base';
import CustomIcon from '../../font/CustomIcon';

export default class HeaderForFeed extends Component {

    state = {
        width:new Animated.Value(1),
        text:null
    }

    _handleInputFocus = () => {
        Animated
            .spring(this.state.width,{
                toValue:2,
                duration:400
            })
            .start();

      //  this.props.onFocus()
    }

    _handleInputBlur = async () => {
        Animated
            .spring(this.state.width,{
                toValue:1,
                duration:400
            })
            .start();

        if(this.state.text != null){
            this.props.onBlur(this.state.text);
        }else{
            this.props.onBlur(null);
        }

    }

  render() {

      const inputWitdhInterpolate = this.state.width.interpolate({
          inputRange: [1, 2],
          outputRange: ['50%', '100%']
      });

      const inputStype = {
          width: inputWitdhInterpolate,
      };


      return (
        <Animated.View style={[styles.headerArea, ]}>
            <Animated.View
                style={[styles.inputArea, inputStype]}>

                <View>
                    <Animated.View style={[styles.accIcon]}>
                        <CustomIcon
                            name="Path-222"
                            size={16}
                            style={{color: '#616D7B'}}
                        />
                    </Animated.View>
                </View>

                <Input
                    style={[styles.input]}
                    placeholder={'Arayın'}
                    value={this.state.text}
                    autoCapitalize={'none'}
                    onChangeText={(val) => {
                        if(val.trim() == ''){
                            this.setState({
                                text:null,
                            });
                            val = null;
                        }else{
                            this.setState({
                                text:val,
                            });
                        }
                    }}
                    onFocus={this._handleInputFocus}
                    onBlur={this._handleInputBlur}
                />

            </Animated.View>

            <View style={{display:'flex', width:'50%', flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
                {this.state.text == null
                ?
                    <Text>
                        <Text style={{fontFamily:'Muli-ExtraBold', color:'#003DFF', fontSize:16}}>maviden</Text><Text style={{fontFamily:'Muli-ExtraBold', color:'#00CFFF', fontSize:16}}>iste</Text>
                    </Text>
                :
                    <TouchableOpacity onPress={async () => {
                        this.setState({
                            text:null,
                        });
                        this.props.onBlur(null);
                    }}>
                        <CustomIcon name="close" size={30} style={{color:'#003DFF'}} />
                    </TouchableOpacity>
                }
            </View>
        </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
    headerArea:{
        paddingHorizontal:15,
        paddingVertical:15,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    inputInfoArea:{
        fontFamily:'Muli-Light',
        fontSize: 14,
        marginHorizontal:2,
        marginVertical: 10
    },
    accIcon:{
        marginLeft: 10,
        marginRight: 5,
       marginTop:2
    },
    input:{
        fontFamily:'Muli-SemiBold',
        fontSize:13,
        marginTop:3,
    },
    inputArea:{
        borderColor:'#fff',
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginLeft:-2,
        height:28,
        backgroundColor:'#fff',
        borderRadius:20,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 1,
    },
});
