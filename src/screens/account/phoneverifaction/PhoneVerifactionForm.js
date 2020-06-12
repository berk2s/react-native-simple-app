import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Keyboard, Platform} from 'react-native';
import {Form, Input, Item, Spinner} from 'native-base';
import CustomIcon from '../../../font/CustomIcon';
import LinearGradient from "react-native-linear-gradient";
import Snackbar from 'react-native-snackbar';
import API from '../../../api';
import {UNIQUE_KEY} from '../../../constants';

import {Formik} from 'formik';
import validationSchema from './validations'
import AuthStore from '../../../store/AuthStore';
export default class PhoneVerifactionForm extends Component {

    state = {
        code:null
    }

    componentDidMount() {

        this.setState({
            code: this.props.navigation.getParam('code').code,
        });

    }

    _handleResend = async () => {
        try{

            const phone_number = this.props.navigation.getParam('phone_number');

            if(this.props.navigation.getParam('page_type') == 1){
                const sendSMS = await API.post('/api/sms/newuser', {
                    phone_number:phone_number,
                    unique_key:UNIQUE_KEY
                });

                if(sendSMS.data.status.code == 'SV_1'){
                    if(sendSMS.data.is_send){
                        Snackbar.show({
                            text: 'Birkaç dakika sonra tekrar deneyiniz',
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor:'#FF9800',
                            textColor:'white',
                        });
                    }

                    this.setState({
                        code: sendSMS.data.data.code,
                    });
                }else{
                    Snackbar.show({
                        text: 'Beklenmedik sorun oluştu',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor:'#FF9800',
                        textColor:'white',
                    });
                }

            }else if(this.props.navigation.getParam('page_type') == 2){
                const sendSMS = await API.post('/api/sms/repass', {
                    phone_number:phone_number,
                    unique_key:UNIQUE_KEY
                });

                if(sendSMS.data.status.code == 'SV_1'){
                    if(sendSMS.data.is_send){
                        Snackbar.show({
                            text: 'Birkaç dakika sonra tekrar deneyiniz',
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor:'#FF9800',
                            textColor:'white',
                        });
                    }

                    this.setState({
                        code: sendSMS.data.data.code,
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

    _handleSubmit = async (values, bag) => {



        const {code} = values;

        if(parseInt(code) == this.state.code){


            try{

                if(this.props.navigation.getParam('page_type') == 1){
                    const name_surname = this.props.navigation.getParam('name_surname');
                    const email_address = this.props.navigation.getParam('email_address');
                    const phone_number = this.props.navigation.getParam('phone_number_clear');
                    const password = this.props.navigation.getParam('password');

                    const {data} = await API.post(`/register`,
                        {
                            name_surname: name_surname,
                            email_address: email_address,
                            phone_number: phone_number,
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

                    }
                }else if(this.props.navigation.getParam('page_type') == 2){

                    this.props.navigation.navigate('ForgotPassStep2', {
                        user_id: this.props.navigation.getParam('user_id'),
                        phone_number: this.props.navigation.getParam('phone_number_clear')
                    });

                }

            }catch(e){
                console.log(e);
            }



        }else{

            bag.setErrors({code:"!"});
            return false;
        }

        return true;

    }

  render() {
    return (
        <View>
            <Form>
                <View style={styles.inputsArea}>
                    <Formik
                        initialValues={{
                            code:''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={this._handleSubmit}
                    >
                        {({values, handleChange, setFieldTouched, handleSubmit, errors, touched, isSubmitting}) => (
                            <>
                            <Item style={[styles.inputAreaFirst, styles.inputArea]} error={errors.code && touched.code}>
                                <View>
                                    <Text style={styles.accIcon}>
                                        <CustomIcon
                                            name="checkmark-circle-2"
                                            size={20}
                                            style={{color: '#616D7B'}}
                                        />
                                    </Text>
                                </View>
                                <Input
                                    style={styles.input}
                                    placeholder="Kod"
                                    placeholderTextColor={'#B4B4B4'}

                                    autoCorrect={false}
                                    returnKeyType={'go'}

                                    value={values.code}
                                    onChangeText={handleChange('code')}
                                    onBlur={() => setFieldTouched('code')}

                                    keyboardType={'numeric'}
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
                                            {!isSubmitting && <Text style={{color:'#fff'}}>Doğrula</Text>}

                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Formik>


                    <View style={styles.helperTextArea}>

                        <Text style={styles.helperText1}>Kod ulaşmadıysa lütfen </Text>
                        <TouchableOpacity onPress={this._handleResend}>
                            <Text style={styles.helperText2}>tekrar deneyin.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Form>
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
