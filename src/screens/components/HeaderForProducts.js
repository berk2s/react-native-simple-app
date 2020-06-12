import React, { Component } from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomIcon from '../../font/CustomIcon';
import {Input, Left} from 'native-base';

export default class HeaderForProducts extends Component {

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
            outputRange: ['44%', '85%']
        });

        const inputStype = {
            width: inputWitdhInterpolate,
        };


        return (
            <View style={styles.headerArea}>

                <View style={styles.arrowBackArea}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.goBack(null)}>
                        <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF'}} />
                    </TouchableOpacity>
                </View>

                <Animated.View
                    style={[styles.inputArea, inputStype]}>

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

                <View style={styles.textArea}>
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
            </View>
        );
    }

}

const styles = StyleSheet.create({
    textArea:{
        display:'flex',
        width:'30%',
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        marginRight:5
    },
    arrowBackArea:{
      marginRight: 25,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    headerArea:{
        paddingHorizontal:5,
        paddingVertical:15,
        height:55,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
      //  backgroundColor:'#f5f5f5'
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
        marginTop:1
    },
    input:{
        fontFamily:'Muli-SemiBold',
        fontSize:13,
        marginTop:3,
        width:50
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
