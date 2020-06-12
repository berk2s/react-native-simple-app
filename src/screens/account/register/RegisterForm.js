import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Linking, Keyboard, Platform} from 'react-native';
import {Form, Input, Item, Spinner} from 'native-base';
import CustomIcon from '../../../font/CustomIcon';
import LinearGradient from "react-native-linear-gradient";

import {Formik} from 'formik';
import validationSchema from './validations'
import { TextInputMask } from 'react-native-masked-text'

import CheckBox from 'react-native-check-box'
import Snackbar from 'react-native-snackbar';


import {UNIQUE_KEY} from '../../../constants'
import {TERMSOFUSE_URL, KVKK_URL} from 'react-native-dotenv'
import API from '../../../api';


export default class RegisterForm extends Component {

    state={
        isChecked_TermsOfUse:false,
        isChecked_KVKK:false,
    }

    _handleSubmit = async (values, bag) => {
        Keyboard.dismiss();
        if(!this.state.isChecked_TermsOfUse){
            Snackbar.show({
                text: 'Kullanım koşullarını kabul etmeniz gerekiyor.',
                duration: 7000,
                backgroundColor:'#bf360c',
                fontFamily:'Muli-Bold',
                textColor:'white',
            });
            return false
        }

        if(!this.state.isChecked_KVKK){
            Snackbar.show({
                text: 'KVKK metnini kabul etmeniz gerekiyor.',
                duration: 7000,
                backgroundColor:'#bf360c',
                fontFamily:'Muli-Bold',
                textColor:'white',
            });
            return false
        }

        try{
            values.phoneNumber = this.phoneNumber.getRawValue();
            const {nameSurname, emailAddress, phoneNumber, password } = values;
            const {data} = await API.post(`/checkuser`,
                {
                    name_surname: nameSurname,
                    email_address: emailAddress,
                    phone_number: phoneNumber,
                    password:password,
                    which_platform: Platform.OS
                }
            );
            if (data.status.code == 'R0' && data.status.whichOne == 'both') {
                    bag.setErrors({emailAddress: '!', phoneNumber:'!'})
                    Snackbar.show({
                        text: 'Böyle bir kullanıcı mevcut',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor:'#d32f2f',
                        textColor:'white',
                        action: {
                            text: 'Şifremi Unuttum',
                            fontFamily:'Muli-ExtraBold',
                            textColor: '#fdd835',
                            onPress: () => { /* Do something. */ },
                        },
                    });
                return false;
            }else if(data.status.code == 'R0' && data.status.whichOne == 'phone'){
                    bag.setErrors({phoneNumber:'!'})
                    Snackbar.show({
                        text: 'Böyle bir numara mevcut',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor:'#d32f2f',
                        textColor:'white',
                        action: {
                            text: 'Şifremi Unuttum',
                            fontFamily:'Muli-ExtraBold',
                            textColor: '#fdd835',
                            onPress: () => { /* Do something. */ },
                        },
                    });
                return false
            }else if (data.status.code == 'R0' && data.status.whichOne == 'email'){
                    bag.setErrors({emailAddress:'!'})
                    Snackbar.show({
                        text: 'Böyle bir e-posta mevcut',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor:'#d32f2f',
                        textColor:'white',
                        action: {
                            text: 'Şifremi Unuttum',
                            fontFamily:'Muli-ExtraBold',
                            textColor: '#fdd835',
                            onPress: () => { /* Do something. */ },
                        },
                    });
                return false
            }else if(data.status.code == 'R1'){
                /*
                    it will be a sms verication area
                 */
                //{phone_number: values.phoneNumber, key: UNIQUE_KEY}

                const sendSMS = await API.post('/api/sms/newuser', {
                    phone_number:`9${values.phoneNumber}`,
                    unique_key:UNIQUE_KEY
                });

                if(sendSMS.data.status.code == 'SV_1'){
                    const {nameSurname, emailAddress, phoneNumber, password } = values;
                    this.props.navigation.navigate('PhoneVerifaction',  {
                        name_surname: nameSurname,
                        email_address: emailAddress,
                        phone_number_clear: this.phoneNumber.getRawValue(),
                        phone_number: '9'+phoneNumber,
                        password:password,
                        which_platform: Platform.OS,
                        code:sendSMS.data.data,
                        page_type:1,
                    });
                }else{
                    Snackbar.show({
                        text: 'Beklenmedik sorun oluştu',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor:'#FF9800',
                        textColor:'white',
                    });
                }
            }
        }catch(e){
            console.log(e);
        }

    }

  render() {
    return (
      <View>
              <View style={styles.inputsArea}>

                  <Formik
                    initialValues={{
                        nameSurname:'',
                        emailAddress:'',
                        password:'',
                        passwordConfirm:'',
                        phoneNumber:'',
                        termsOfUse:''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={this._handleSubmit}
                  >
                      {({values, handleChange, setFieldTouched, handleSubmit, errors, touched, isSubmitting}) => (
                        <>
                            <Item style={[styles.inputAreaFirst, styles.inputArea]} error={errors.nameSurname && touched.nameSurname}>
                                <Text style={styles.passIcon}>
                                    <CustomIcon
                                        name="person"
                                        size={20}
                                        style={{color: '#616D7B'}}
                                    />
                                </Text>
                                <Input
                                    style={styles.input}
                                    placeholder="Adın soyadın"
                                    placeholderTextColor={'#B4B4B4'}
                                    autoCorrect={false}
                                    returnKeyType={'next'}

                                    value={values.nameSurname}
                                    onChangeText={handleChange('nameSurname')}
                                    onSubmitEditing={() => this.emailAddress._root.focus()}
                                    onBlur={() => setFieldTouched('nameSurname')}
                                />
                            </Item>

                            <Item style={[styles.inputAreaLast, styles.inputArea]} error={errors.emailAddress && touched.emailAddress}>
                                <View>
                                    <Text style={styles.accIcon}>
                                        <CustomIcon
                                            name="at"
                                            size={20}
                                            style={{color: '#616D7B'}}
                                        />
                                    </Text>
                                </View>
                                <Input
                                    style={styles.input}
                                    placeholder="E-Mail adresi"
                                    placeholderTextColor={'#B4B4B4'}
                                    returnKeyType={'next'}
                                    keyboardType={'email-address'}
                                    autoCapitalize={'none'}

                                    value={values.emailAddress}
                                    onChangeText={handleChange('emailAddress')}
                                    onSubmitEditing={() => this.phoneNumber.getElement().focus()}
                                    onBlur={() => setFieldTouched('emailAddress')}

                                    ref={(ref) => this.emailAddress = ref}
                                />
                            </Item>

                            <Item style={[styles.inputAreaLast, styles.inputArea]} error={errors.phoneNumber && touched.phoneNumber}>

                                <Text style={styles.passIcon}>
                                    <CustomIcon
                                        name="phone"
                                        size={20}
                                        style={{color: '#616D7B'}}
                                    />
                                </Text>
                                <TextInputMask
                                    style={styles.input}
                                    placeholder="Telefon numarası"
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
                            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>

                                <Item style={[styles.inputAreaLast, styles.inputArea, {width:'45%'}]} error={errors.password && touched.password}>
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
                                        secureTextEntry
                                        returnKeyType={'next'}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}

                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onSubmitEditing={() => this.passwordConfirm._root.focus()}
                                        onBlur={() => setFieldTouched('password')}

                                        ref={(ref) => this.password = ref}
                                    />
                                </Item>

                                <Item style={[styles.inputAreaLast, styles.inputArea, {width:'45%'}]} error={errors.passwordConfirm && touched.passwordConfirm}>
                                    <Text style={styles.passIcon}>
                                        <CustomIcon
                                            name="unlock"
                                            size={20}
                                            style={{color: '#616D7B'}}
                                        />
                                    </Text>
                                    <Input
                                        style={styles.input}
                                        placeholder="Şifre Tekrarı"
                                        placeholderTextColor={'#B4B4B4'}
                                        secureTextEntry
                                        returnKeyType={'go'}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}

                                        value={values.passwordConfirm}
                                        onChangeText={handleChange('passwordConfirm')}
                                        onBlur={() => setFieldTouched('passwordConfirm')}

                                        ref={ref => this.passwordConfirm = ref}
                                    />
                                </Item>

                            </View>

                            <CheckBox
                                style={{flex: 1,}}
                                onClick={()=>{
                                    this.setState({
                                        isChecked_TermsOfUse:!this.state.isChecked_TermsOfUse
                                    })
                                }}
                                isChecked={this.state.isChecked_TermsOfUse}
                                checkBoxColor={'#616D7B'}
                                rightText={
                                    <>
                                        <Text onPress={() => Linking.openURL(TERMSOFUSE_URL)} style={{color:'blue', fontFamily:'Muli-Regular'}}>Üyelik Sözleşmesi</Text>
                                        <Text style={{color:'#616D7B', fontFamily:'Muli-Regular'}}>'ni okudum ve kabul ediyorum.</Text>
                                    </>}

                            />


                            <CheckBox
                                style={{flex: 1, marginTop:15}}
                                onClick={()=>{
                                    this.setState({
                                        isChecked_KVKK:!this.state.isChecked_KVKK
                                    })
                                }}
                                isChecked={this.state.isChecked_KVKK}
                                checkBoxColor={'#616D7B'}
                                rightText={
                                    <>
                                        <Text onPress={() => Linking.openURL(KVKK_URL)} style={{color:'blue', fontFamily:'Muli-Regular'}}>KVKK Aydınlatma Metni</Text>
                                        <Text style={{color:'#616D7B', fontFamily:'Muli-Regular'}}>'ni okudum ve kabul ediyorum.</Text>
                                    </>}

                            />


                            <View style={styles.btnArea}>
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={handleSubmit}
                                >
                                    <LinearGradient
                                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                        colors={['#1100FF', '#4855FF', '#0077FF']} style={styles.btn}>

                                        {isSubmitting && <Spinner size={'small'} color={'#fff'} />}
                                        {!isSubmitting && <Text style={{color:'#fff'}}>Kayıt</Text>}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </>
                      )}

                  </Formik>
                  <View style={styles.helperTextArea}>

                      <Text style={styles.helperText1}>Zaten hesabınız var mı? </Text>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                          <Text style={styles.helperText2}>Giriş yapın.</Text>
                      </TouchableOpacity>
                  </View>
              </View>
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
        color: '#304555',
    },
    inputAreaFirst: {
        marginTop: 30,
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
