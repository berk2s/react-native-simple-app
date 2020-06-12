import React, { Component } from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Keyboard} from 'react-native';
import CustomIcon from '../../../../../font/CustomIcon';
import {Body, Button, Input, Item, Left, ListItem, Right, Switch} from 'native-base';

import {Formik} from 'formik'
import Spinner from 'react-native-loading-spinner-overlay';
import API from '../../../../../api';
import AuthStore from '../../../../../store/AuthStore';
import Snackbar from 'react-native-snackbar';
import {observer} from 'mobx-react';

import validationSchema from './validations'

@observer
export default class ChangePasswordForm extends Component {

    state = {
        loading: false,
    }

    _handleSubmit = async (values,bag) => {
        try{
            Keyboard.dismiss()
            const {currentpassword, newpassword} = values;

            const {data} = await API.put('/api/user/password', {
                currentpassword:currentpassword,
                newpassword:newpassword,
                user_id: AuthStore.getUserID
            }, {
                headers: {
                    'x-access-token': AuthStore.getToken
                }
            });

            if(data.status.code == 'RP_1'){
                Snackbar.show({
                    text: data.data,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#d32f2f',
                    textColor:'white',
                });
            }else if(data.status.code == 'RP_2'){
                Snackbar.show({
                    text: data.data,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#4CAF50',
                    textColor:'white',
                });
            }

        }catch(e){
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            return false;
        }
    }

    render() {
        return (
            <>
                <Spinner
                    visible={this.state.loading}
                    animation={'fade'}
                    size={'small'}
                />
                <Formik
                    initialValues={{
                        currentpassword: '',
                        newpassword: '',
                        newpassword_verifaction: '',
                    }}
                    onSubmit={this._handleSubmit}
                    validationSchema={validationSchema}
                >
                    {({values, handleChange, setFieldTouched, handleSubmit, errors, touched, isSubmitting}) => (
                        <View style={styles.inputFormArea}>
                            <View style={styles.inputs}>
                                <Text style={styles.inputInfoArea}>Mevcut şifre {(errors.currentpassword && touched.currentpassword) && <Text style={{color:'red', fontSize:10}}>{errors.currentpassword}</Text>}</Text>
                                <Item
                                    style={styles.inputArea}>
                                    <Input
                                        style={[styles.input, {zIndex:9}]}
                                        value={values.currentpassword}
                                        onChangeText={handleChange('currentpassword')}
                                        onBlur={() => setFieldTouched('currentpassword')}
                                        secureTextEntry
                                        autoCorrect={false}
                                    />

                                </Item>
                            </View>


                            <View style={styles.inputs}>
                                <Text style={styles.inputInfoArea}>Yeni şifre {(errors.newpassword && touched.newpassword) && <Text style={{color:'red', fontSize:10}}>{errors.newpassword}</Text>}</Text>
                                <Item
                                    style={styles.inputArea}>
                                    <Input
                                        style={[styles.input, {zIndex:9}]}
                                        value={values.newpassword}
                                        onChangeText={handleChange('newpassword')}
                                        onBlur={() => setFieldTouched('newpassword')}
                                        ref={(ref) => this.newpassword = ref}
                                        secureTextEntry
                                        autoCorrect={false}
                                    />
                                    <View style={{marginRight:5}}>
                                        <Text style={styles.accIcon}>
                                            <CustomIcon
                                                name="unlock"
                                                size={18}
                                                style={{color: '#616D7B'}}
                                            />
                                        </Text>
                                    </View>
                                </Item>
                            </View>

                            <View style={styles.inputs}>
                                <Text style={styles.inputInfoArea}>Yeni şifre tekrarı {(errors.newpassword_verifaction && touched.newpassword_verifaction) && <Text style={{color:'red', fontSize:10}}>{errors.newpassword_verifaction}</Text>}</Text>
                                <Item
                                    style={styles.inputArea}>
                                    <Input
                                        style={[styles.input, {zIndex:9}]}
                                        value={values.newpassword_verifaction}
                                        onChangeText={handleChange('newpassword_verifaction')}
                                        onBlur={() => setFieldTouched('newpassword_verifaction')}
                                        secureTextEntry
                                        autoCorrect={false}
                                    />
                                    <View style={{marginRight:5}}>
                                        <Text style={styles.accIcon}>
                                            <CustomIcon
                                                name="unlock"
                                                size={18}
                                                style={{color: '#616D7B'}}
                                            />
                                        </Text>
                                    </View>
                                </Item>
                            </View>

                            <Button
                                onPress={handleSubmit}
                                style={{borderRadius:8, marginTop:20, marginBottom:10, height:38, backgroundColor:'#7FB7EA', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>

                                {isSubmitting && <ActivityIndicator /> }
                                {!isSubmitting && <Text style={{color:'#fff', fontFamily:'Muli-ExtraBold'}}>Değiştir</Text> }


                            </Button>

                        </View>
                    )}
                </Formik>
            </>

        );
    }
}

const styles = StyleSheet.create({
    inputs:{
        marginBottom:10
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
        paddingLeft:15,
    },
    inputArea:{
        borderColor:'#fff',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:40,
        backgroundColor:'#fff',
        borderRadius:10,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 1,
    },
    inputFormArea:{
     //   marginVertical:15
    },
    profileIntoTextArea:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
       // paddingHorizontal:15,
        width:'70%',
    },
    profileCircle:{
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:'#8394CB',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        shadowColor: '#000',
        shadowOpacity:0.15,
        shadowRadius: 9,
        shadowOffset: {
            height: 0,
        },
        elevation:5,

        borderTopColor: 'transparent',

    },
});
