import React, { Component } from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Form, Input, Item, Spinner} from 'native-base';
import CustomIcon from '../../../../font/CustomIcon';
import LinearGradient from "react-native-linear-gradient";

import {Formik} from 'formik'
import {TextInputMask} from 'react-native-masked-text';

import validationSchema from './validations'
import API from '../../../../api';
import Snackbar from 'react-native-snackbar';
import {UNIQUE_KEY} from '../../../../constants';

export default class Step1Form extends Component {

    _handleSubmit = async(values, bag) => {
        try{
            values.phone_number = this.phone_number.getRawValue();

            const {data} = await API.post('/checkrepass', {
                phone_number: values.phone_number
            });

            if(data.status.code == 'RR_0'){

                Snackbar.show({
                    text: data.data,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                return false;
            }else if(data.status.code == 'RR_1'){

                const sendSMS = await API.post('/api/sms/repass', {
                    phone_number:`9${values.phone_number}`,
                    unique_key:UNIQUE_KEY
                });

                if(sendSMS.data.status.code == 'SV_1'){
                    this.props.navigation.navigate('PhoneVerifaction',  {
                        user_id: data.data._id,
                        phone_number_clear:values.phone_number,
                        phone_number: '9'+values.phone_number,
                        page_type:2,
                        code:sendSMS.data.data,
                    });
                }else{
                    Snackbar.show({
                        text: 'Beklenmedik sorun oluştu (RROF2)',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor:'#FF9800',
                        textColor:'white',
                    });
                }

            }else{
                Snackbar.show({
                    text: 'Beklenmedik sorun oluştu (RROF1)',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
            }

        }catch(e){
            console.log(e);
        }
    }

  render() {
    return (
        <View>
            <Formik
                initialValues={{
                    phone_number:''
                }}
                onSubmit={this._handleSubmit}
                validationSchema={validationSchema}
            >
                {({values, handleChange, setFieldTouched, handleSubmit, errors, touched, isSubmitting}) => (
                    <View style={styles.inputsArea}>
                        <Item style={[styles.inputAreaFirst, styles.inputArea]} error={errors.phone_number && touched.phone_number}>
                            <View>
                                <Text style={styles.accIcon}>
                                    <CustomIcon
                                        name="phone"
                                        size={20}
                                        style={{color: '#616D7B'}}
                                    />
                                </Text>
                            </View>
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

                                value={values.phone_number}
                                onChangeText={handleChange('phone_number')}
                                onBlur={() => setFieldTouched('phone_number')}

                                ref={(ref) => this.phone_number = ref}
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
                                    {!isSubmitting && <Text style={{color:'#fff'}}>İlerle</Text>}

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
