import React, { Component } from 'react';
import {StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, PermissionsAndroid, Linking, Alert, Platform} from 'react-native';

import {Body, Input, Item, Left, ListItem, Right, Button, Textarea} from 'native-base';

import {Formik} from 'formik'
import Spinner from 'react-native-loading-spinner-overlay';

import Snackbar from 'react-native-snackbar';
import CustomIcon from '../../../../../../font/CustomIcon';

import RNPickerSelect from 'react-native-picker-select';
import {observer} from 'mobx-react';
import LocationAPI from '../../../../../../locationapi';
import API from '../../../../../../api';

import validationSchema from './validation'
import AuthStore from '../../../../../../store/AuthStore';
import Geolocation from '@react-native-community/geolocation';

import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import AddressStore from '../../../../../../store/AddressStore';

import BranchStore from '../../../../../../store/BranchStore';
import Ripple from 'react-native-material-ripple';
import {add} from 'react-native-reanimated';

@observer
export default class AddAddressForm extends Component {

    state = {
        loading: false,
        language:'java',
        provinces: [],
        counties:[],
        districts: [],
        selectedProvince: null,
        selectedCounty: null,
        selectedDistrict:null,
        hasError:false,
        step:0,
        errors:['','','','','']
    }

    componentDidMount() {
        const data = this.props.navigation.getParam('provinces')
        data.map(e => {
            this.state.provinces.push({label: e.il_adi, value:{text:e.il_adi, value: e.id}})
        })
    }

    _handleProvinceDone = async (value=null) => {
        try{

            const provinceID = value != null ? value : this.state.selectedProvince;

            const datas = await LocationAPI.get(`/api/location/county/${provinceID}`);
            this.setState({
                counties: [],
            });
            datas.data.map(e => {
                this.state.counties.push({label: e.ilce_adi, value:{text:e.ilce_adi, value: e.id}})
            });
            return datas.data.length
           // this.countySelect.togglePicker();


        }catch(e){
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            this.setState({
                loading:false,
            });
            return false;
        }
    }

    _handleCountyDone = async () => {
    //    this.address._root.focus()
    }

    _handleSubmit = async(values, bag) => {
        try{
            const  { title_address,address,desc_address,province,county } = values;

            const indexOfTitle = AddressStore.getAddress.map(e => e.address_title.trim()).indexOf(title_address.trim())

            if(title_address.trim() == ''){
                this.setState({
                    step:0,
                });
                Snackbar.show({
                    text: 'Adres başlığı girmeniz gerekli',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                return false;
            }

            if(typeof province === 'string' && province.trim() === ''){
                this.setState({
                    step:1,
                });
                Snackbar.show({
                    text: 'Bir il seçmeniz gerekli',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                return false;
            }

            if(typeof province === 'string' && county.trim() == ''){
                this.setState({
                    step:2,
                });
                Snackbar.show({
                    text: 'Bir il seçmeniz gerekli',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                return false;
            }


            if(address.trim() == ''){
                this.setState({
                    step:3,
                });
                Snackbar.show({
                    text: 'Adres girmeniz gerekli',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                return false;
            }else if(address.length <= 10){
                this.setState({
                    step:3,
                });
                Snackbar.show({
                    text: 'Daha uzun adres giriniz',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                return false;
            }

            if(indexOfTitle !== -1){
                Snackbar.show({
                    text: 'Aynı başlığa sahip adresiniz bulunmaktadır ',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                bag.setErrors('title_address', '!');
                return false
            }

            console.log(BranchStore.branchList.map(e => e.branch_province))
            if(BranchStore.branchList.map(e => e.branch_province).indexOf(''+province.value) === -1){
                Snackbar.show({
                    text: 'Seçtiğiniz ilde bayimiz bulunmamaktadır ',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                bag.setErrors('province', '!');
                return false;
            }

            if(BranchStore.branchList.map(e => e.branch_county).indexOf(''+county.value) === -1){
                Snackbar.show({
                    text: 'Seçtiğiniz ilçede bayimiz bulunmamaktadır ',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#FF9800',
                    textColor:'white',
                });
                bag.setErrors('county', '!');
                return false;
            }

            let desc_address_ = null;

            if(desc_address.trim() != '')
                desc_address_ = desc_address;

            const userid = await AuthStore.getUserIdFromRepo();
            const postit = await API.post(`/api/user/address`, {address_ltd:this.props.navigation.getParam('selected_ltd'),address_lng:this.props.navigation.getParam('selected_lng'),address_title:title_address,address:address,address_direction:desc_address_,address_province:province,address_county:county, user_id:userid}, {
                headers:{
                    'x-access-token': AuthStore.getToken
                }
            });
            if(Array.isArray(postit.data.data))
                await AddressStore.setAddress(postit.data.data);
            this.props.navigation.navigate('AddressList', {address: postit.data.data});
        }catch(e){
            console.log(e)
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            this.setState({
                loading:false,
            });
            return false;
        }
    }

    render() {
        return (
            <View style={{display:'flex',flex:1,height:'100%', justifyContent:'center', alignItems:'center'}}>

                <Formik
                    initialValues={{
                        title_address: '',
                        address: '',
                        desc_address: '',
                        province:'',
                        county:''
                    }}
                    onSubmit={this._handleSubmit}
                >
                    {({values, setFieldValue, handleChange, touched, setFieldTouched, errors, handleSubmit, isSubmitting}) => (
                        <View style={styles.inputFormArea}>
                            <Spinner
                                visible={this.state.loading}
                                size={'small'}
                            />
                            {
                                this.state.step == 0 && <View style={styles.inputs}>
                                    <Text style={styles.inputInfoArea}>Adres başlığı <Text style={{color:'red', fontSize:12}}>{this.state.errors[0]}</Text> </Text>
                                    <Item
                                        style={styles.inputArea}>
                                        <Input
                                            style={[styles.input, {zIndex:9}]}
                                            value={values.title_address}
                                            onChangeText={handleChange('title_address')}
                                            returnKeyType={'next'}
                                        />
                                        <View style={{marginRight:5}}>
                                            <Text style={styles.accIcon}>
                                                <CustomIcon
                                                    name="edit-2"
                                                    size={18}
                                                    style={{color: '#616D7B'}}
                                                />
                                            </Text>
                                        </View>
                                    </Item>
                                </View>
                            }


                            {
                                this.state.step == 1 && <View style={styles.inputs}>
                                    <Text style={styles.inputInfoArea}>İl {(!!errors.province) ? <Text style={{color:'red', fontSize:12}}>Gerekli</Text> : <></>}  </Text>
                                    <Item
                                        style={styles.inputAreaForPicker}>
                                        <RNPickerSelect
                                            onValueChange={async (value) => {
                                                if(typeof value !== 'undefined') {
                                                    if (Platform.OS === 'android') {
                                                        this.setState({
                                                            loading: true,
                                                        });

                                                        setFieldValue('province', value);

                                                        const pdone = await this._handleProvinceDone(value.value);
                                                        this.setState({selectedProvince: value.value,});

                                                        setTimeout(() => {
                                                            this.setState({
                                                                loading: false,
                                                            });
                                                        }, 500);

                                                    } else {
                                                        this.setState({
                                                            loading: true,
                                                        });

                                                        this.setState({selectedProvince: value.value,});
                                                        setFieldValue('province', value);
                                                        setTimeout(() => {
                                                            this.setState({
                                                                loading: false,
                                                            });
                                                        }, 500);
                                                    }
                                                }
                                            }}
                                            style={pickerStyle}
                                            value={values.province}
                                            items={this.state.provinces}
                                            placeholder={{label: 'Bir il seçin'}}
                                            doneText={'Tamam'}
                                            onDonePress={this._handleProvinceDone}
                                        />
                                    </Item>

                                </View>
                            }

                            {
                                this.state.step == 2 && <View style={styles.inputs}>
                                    <Text style={styles.inputInfoArea}>İlçe {(!!errors.county) ? <Text style={{color:'red', fontSize:12}}>Gerekli</Text> : <></>}</Text>
                                    <Item
                                        style={styles.inputAreaForPicker}>
                                        <RNPickerSelect
                                            onValueChange={(value) => {
                                                setFieldValue('county', value)
                                                if(Platform.OS === 'android'){
                                                    this._handleCountyDone()
                                                }
                                            }}
                                            value={values.county}
                                            style={pickerStyle}
                                            items={this.state.counties}
                                            doneText={'Tamam'}
                                            placeholder={{label: 'Bir ilçe seçin'}}
                                            onDonePress={this._handleCountyDone}
                                        />
                                    </Item>
                                </View>
                            }

                            {
                                this.state.step == 3 &&  <View style={styles.inputs}>
                                    <View style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text style={styles.inputInfoArea}>Adres {(errors.address && touched.address) ? <Text style={{color:'red', fontSize:12}}>{errors.address}</Text> : <></>}</Text>
                                    </View>


                                    <Textarea
                                        rowSpan={1}
                                        style={[styles.inputArea, {fontFamily:'Muli-Regular',fontSize:12, zIndex:9, height:100}]}
                                        value={values.address}
                                        onChangeText={handleChange('address')}
                                        returnKeyType={'next'}
                                        ref={ref => this.desc_address = ref}
                                    />




                                </View>

                            }

                            {
                                this.state.step == 4 && <View style={styles.inputs}>
                                    <Text style={styles.inputInfoArea}>Adres tarifi (opsiyonel)</Text>

                                    <Textarea
                                        style={[styles.inputArea, {fontFamily:'Muli-Regular',fontSize:12,zIndex:9, height:100}]}
                                        value={values.desc_address}
                                        onChangeText={handleChange('desc_address')}
                                        returnKeyType={'go'}
                                        ref={ref => this.desc_address = ref}
                                    />



                                </View>

                            }

                            <View style={{ height:220, bottom:0, marginTop:2, width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>


                                    <Ripple
                                        rippleCentered={true}
                                        rippleContainerBorderRadius={2}
                                        rippleOpacity={0.1}
                                        rippleDuration={500}
                                        style={[styles.dotChoice, {backgroundColor:'#fff', borderWidth:1, borderColor:'#B2EBF2'}]}
                                        onPress={() => {

                                            if(this.state.step == 0){
                                                this.props.navigation.goBack()
                                            }else{
                                                this.setState({
                                                    step: this.state.step-1,
                                                });
                                            }

                                        }}
                                    >
                                        <Text style={{fontFamily:'Muli-Bold', fontSize:14, color:'#757575'}}>Geri</Text>
                                    </Ripple>

                                    {
                                        this.state.step == 4 ?    <Ripple
                                            rippleCentered={true}
                                            rippleContainerBorderRadius={2}
                                            rippleOpacity={0.1}
                                            rippleDuration={500}
                                            style={styles.dotChoice}
                                            onPress={handleSubmit}
                                        >
                                            {isSubmitting && <ActivityIndicator /> }
                                            {!isSubmitting && <Text style={{fontFamily:'Muli-Bold', fontSize:14, color:'#757575'}}>Kaydet</Text>}
                                        </Ripple> : <Ripple
                                                rippleCentered={true}
                                                rippleContainerBorderRadius={2}
                                                rippleOpacity={0.1}
                                                rippleDuration={500}
                                                style={styles.dotChoice}
                                                onPress={() => {
                                                    this.setState({
                                                        step: this.state.step+1,
                                                    });
                                                }}
                                            >
                                                <Text style={{fontFamily:'Muli-Bold', fontSize:14, color:'#757575'}}>İlerle</Text>
                                            </Ripple>

                                    }

                            </View>



                        </View>
                    )}
                </Formik>
            </View>
        );
    }
}

const pickerStyle = StyleSheet.create({

    inputIOS: {
        minWidth:'100%',
        color:'#000',
        fontFamily:'Muli-Bold',
        height:25
    },
    inputAndroid: {
        minWidth:'106%',
        color:'#000',
        fontFamily:'Muli-Bold',
        marginTop:-15,
        marginLeft:-10,
        height:45
    },
})

const styles = StyleSheet.create({
    dotChoice:{
        borderRadius:10,
        backgroundColor:'#B2EBF2',
        height:42,
        width:'45%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    inputAreaForPicker:{
        borderColor:'#fff',
        paddingHorizontal:13,
        paddingTop:11,
        height:45,
        width:'100%',
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
    inputs:{
        marginBottom:30
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
        height:45,
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
        width:'100%',
        height:'100%',
        flex:1,
    },
    profileIntoTextArea:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        paddingHorizontal:15,
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
        elevation:1,

        borderTopColor: 'transparent',

    },
});
