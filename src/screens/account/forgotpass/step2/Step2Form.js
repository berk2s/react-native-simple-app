import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Form, Input, Item, Spinner} from 'native-base';
import CustomIcon from '../../../../font/CustomIcon';
import LinearGradient from "react-native-linear-gradient";

import {Formik} from 'formik';
import API from '../../../../api';
import Snackbar from 'react-native-snackbar';
import AuthStore from '../../../../store/AuthStore';

import validationSchema from './validations'

export default class Step2Form extends Component {

    _handleSubmit = async (values, bag) => {
        try{
            const user_id = this.props.navigation.getParam('user_id');
            const phone_number = this.props.navigation.getParam('phone_number');

            const {password} = values;
            const rePass = await API.post('/resetpass', {
                password:password,
                user_id:user_id
            });

            if(rePass.data.status.code == 'RP_1'){

                Snackbar.show({
                    text: 'Şifreniz değiştirildi',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#4CAF50',
                    textColor:'white',
                });

                const auth = await API.post(`/authenticate`,
                    {
                        phone_number: phone_number,
                        password:password,
                    }
                );
                if(auth.data.status.code == 'A2'){
                    const token = auth.data.status.token;
                    const user_id = auth.data.status.user_id;
                    const name_surname = auth.data.status.name_surname;
                    await AuthStore.saveToken(user_id, token, name_surname);
                }else{
                    Snackbar.show({
                        text: 'Beklenmedik hata oluştu (SVA3812)',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor:'#d32f2f',
                        textColor:'white',
                    });
                }

            }else if(rePass.data.status.code == 'R_ERROR'){

                Snackbar.show({
                    text: 'Beklenmedik sorun oluştu (RPO22)',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });

            }

        }catch(e){

        }
    }

  render() {
    return (
        <View>
            <Formik
                initialValues={{
                    password:'',
                    passwordConfirm:''
                }}
                validationSchema={validationSchema}
                onSubmit={this._handleSubmit}
            >
                {({values, handleChange, setFieldTouched, handleSubmit, errors, touched, isSubmitting}) => (
                    <View style={styles.inputsArea}>
                        <Item style={[styles.inputAreaFirst, styles.inputArea]} error={errors.password && touched.password}>
                            <View>
                                <Text style={styles.accIcon}>
                                    <CustomIcon
                                        name="unlock"
                                        size={20}
                                        style={{color: '#616D7B'}}
                                    />
                                </Text>
                            </View>
                            <Input
                                style={styles.input}
                                placeholder="Yeni şifre"
                                placeholderTextColor={'#B4B4B4'}


                                secureTextEntry
                                returnKeyType={'next'}
                                autoCapitalize={'none'}
                                autoCorrect={false}

                                value={values.password}
                                onChangeText={handleChange('password')}
                                onSubmitEditing={() => this.passwordConfirm._root.focus()}
                                onBlur={() => setFieldTouched('password')}

                            />
                        </Item>

                        <Item style={[styles.inputAreaLast, styles.inputArea]} error={errors.passwordConfirm && touched.passwordConfirm}>
                            <View>
                                <Text style={styles.accIcon}>
                                    <CustomIcon
                                        name="unlock"
                                        size={20}
                                        style={{color: '#616D7B'}}
                                    />
                                </Text>
                            </View>
                            <Input
                                style={styles.input}
                                placeholder="Yeni şifre tekrarı"
                                placeholderTextColor={'#B4B4B4'}

                                secureTextEntry
                                returnKeyType={'go'}
                                autoCapitalize={'none'}
                                autoCorrect={false}

                                value={values.passwordConfirm}
                                onChangeText={handleChange('passwordConfirm')}
                                onBlur={() => setFieldTouched('passwordConfirm')}

                                ref={(ref) => this.passwordConfirm = ref}

                            />
                        </Item>

                        <View style={styles.btnArea}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={handleSubmit}
                            >
                                <LinearGradient
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                    colors={['#1100FF', '#4855FF', '#0077FF']} style={styles.btn}>

                                    {isSubmitting && <Spinner size={'small'} color={'#fff'} />}
                                    {!isSubmitting && <Text style={{color:'#fff'}}>Değiştir</Text>}

                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
            </Formik>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    helperTextArea:{
        display:'flex',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
        marginTop:32,
        marginBottom:72
    },
    helperText1:{
        fontFamily:'Muli-Bold',
        color:'#787878'
    },
    helperText2:{
        fontFamily:'Muli-Bold',
        color:'#FF0000'
    },
    btn:{
        width:78,
        height:25,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20
    },
    btnArea:{
        display:'flex',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:20
    },
    forgotPassArea:{
        display:'flex',
        flex:1,
        justifyContent:'center',
        alignItems:'flex-end'
    },
    forgotPassText:{
        fontFamily:'Muli-SemiBold',
        color:'#FF0000',
        fontSize:10
    },
    container: {
        flex: 1,
    },
    subContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        paddingVertical: '10%',
    },
    logoArea: {
        marginVertical: 65,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 96,
        height: 89,
    },
    textArea: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#003DFF',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Muli-Bold',
    },
    input: {
        width: '100%',
        height: 34,
        fontSize: 13,
        paddingLeft: 15,
        fontFamily: 'Muli-SemiBold',
        color: '#B4B4B4',
    },
    inputAreaFirst: {
        marginTop: 50,
        marginBottom: 30,
    },
    inputAreaLast: {
        marginBottom: 30,
    },
    inputAreaLast1: {
        marginBottom: 10,
    },
    inputArea: {
        height: 34,
    },
    inputsArea: {
        marginHorizontal: '10%',
    },
    passIcon: {},
    accIcon: {
        fontFamily: 'fontello',
    },
});
