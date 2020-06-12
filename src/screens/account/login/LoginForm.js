import React, { Component } from 'react';
import {Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Form, Input, Item, Spinner} from 'native-base';
import CustomIcon from '../../../font/CustomIcon';
import LinearGradient from "react-native-linear-gradient";

import { TextInputMask } from 'react-native-masked-text'

import {Formik} from 'formik';
import validationSchema from './validations';
import API from '../../../api';
import Snackbar from 'react-native-snackbar';

import {observer} from 'mobx-react';

import AuthStore from '../../../store/AuthStore';

@observer
export default class LoginForm extends Component {

    _handleSubmit = async (values, bag) => {
        Keyboard.dismiss();
        try {
            const phoneNumber = this.phoneNumber.getRawValue();
            const {password} = values;
            const {data} = await API.post(`/authenticate`,
                {
                    phone_number: phoneNumber,
                    password:password,
                }
            );
            if(data.status.code == 'A0'){
                bag.setErrors({phoneNumber:'!'})
                Snackbar.show({
                    text: 'Geçersiz telefon numarası',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#d32f2f',
                    textColor:'white',
                    action: {
                        text: 'Kayıt ol',
                        fontFamily:'Muli-ExtraBold',
                        textColor: '#fdd835',
                        onPress: () => { /* Do something. */ },
                    },
                });
            }else if(data.status.code == 'A1') {
                bag.setErrors({password:'!'})
                Snackbar.show({
                    text: 'Hatalı şifre girdiniz',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#d32f2f',
                    textColor:'white',
                    action: {
                        text: 'Şifremi unuttum',
                        fontFamily:'Muli-ExtraBold',
                        textColor: '#fdd835',
                        onPress: () => { /* Do something. */ },
                    },
                });
            }else if(data.status.code == 'A2'){
                const token = data.status.token;
                const user_id = data.status.user_id;
                const name_surname = data.status.name_surname;

                await AuthStore.saveToken(user_id, token, name_surname);
            }
        }catch(e){
            console.log(e)
        }
    }



  render() {
    return (
      <View>
          <Formik
            initialValues={{
                phoneNumber:'',
                password:''
            }}
            validationSchema={validationSchema}
            onSubmit={this._handleSubmit}
          >
              {({values, handleChange, setFieldTouched, handleSubmit, errors, touched, isSubmitting}) => (
                  <View style={styles.inputsArea}>
                      <Item style={[styles.inputAreaFirst, styles.inputArea]} error={errors.phoneNumber && touched.phoneNumber}>
                          <View>
                              <Text style={styles.accIcon}>
                                  <CustomIcon
                                      name="person"
                                      size={20}
                                      style={{color: '#616D7B'}}
                                  />
                              </Text>
                          </View>
                          <TextInputMask
                              style={styles.input}
                              placeholder="Telefon numaranız"
                              placeholderTextColor={'#B4B4B4'}
                              autoCorrect={false}
                              returnKeyType={'next'}

                              type={'custom'}
                              options={{
                                  mask: '0 (999) 999 9999',
                                  getRawValue: function(value, settings) {
                                      return value.replace(/\D/g,'');
                                  },
                              }}

                              value={values.phoneNumber}
                              onChangeText={handleChange('phoneNumber')}
                              onSubmitEditing={() => this.password._root.focus()}
                              onBlur={() => setFieldTouched('phoneNumber')}
                              ref={(ref) => this.phoneNumber = ref}
                          />
                      </Item>
                      <Item style={[styles.inputAreaLast, styles.inputArea]} error={errors.password && touched.password}>
                          <Text style={styles.passIcon}>
                              <CustomIcon
                                  name="unlock"
                                  size={20}
                                  style={{color: '#616D7B'}}
                              />
                          </Text>
                          <Input
                              style={styles.input}
                              placeholder="Şifre"
                              placeholderTextColor={'#B4B4B4'}
                              returnKeyType={'go'}
                              secureTextEntry

                              autoCapitalize={'none'}

                              value={values.password}
                              onChangeText={handleChange('password')}
                              onBlur={() => setFieldTouched('password')}

                              ref={(ref) => this.password = ref}
                          />
                      </Item>

                      <View style={styles.forgotPassArea}>

                          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassStep1')}>
                              <Text style={styles.forgotPassText}>Şifremi Unuttum</Text>
                          </TouchableOpacity>

                      </View>

                      <View style={styles.btnArea}>
                          <TouchableOpacity
                              style={styles.btn}
                              onPress={handleSubmit}
                          >
                              <LinearGradient
                                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                  colors={['#1100FF', '#4855FF', '#0077FF']} style={styles.btn}>

                                  {isSubmitting && <Spinner size={'small'} color={'#fff'} />}
                                  {!isSubmitting && <Text style={{color:'#fff'}}>Giriş</Text>}
                              </LinearGradient>
                          </TouchableOpacity>
                      </View>

                      <View style={styles.helperTextArea}>

                          <Text style={styles.helperText1}>Hesabınız yok mu? </Text>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                              <Text style={styles.helperText2}>Hemen kayıt olun.</Text>
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
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:32,
        marginBottom:50
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
        width:60,
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
        marginTop:35
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
        marginVertical: 45,
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
        color: '#304555',
    },
    inputAreaFirst: {
        marginTop: 30,
        marginBottom: 30,
    },
    inputAreaLast: {
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
