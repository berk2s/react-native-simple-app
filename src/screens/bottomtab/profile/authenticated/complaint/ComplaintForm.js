import React, { Component } from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {Formik} from 'formik';
import validationSchema from './validations';
import {Button, Input, Item, Textarea} from 'native-base';
import CustomIcon from '../../../../../font/CustomIcon';
import RNPickerSelect from "react-native-picker-select";

import LocationAPI from '../../../../../locationapi';
import {observer} from 'mobx-react';

import BranchStore from '../../../../../store/BranchStore';
import AuthStore from '../../../../../store/AuthStore';
import Snackbar from 'react-native-snackbar';

@observer
export default class ComplaintForm extends Component {

  state = {
    loading: false,
    selectedOrder:null,
    orders:[],
    complaint:'',
  }

  _handleSubmit = async (values) => {

    try{

      if(this.state.complaint.trim() == ''){
        Snackbar.show({
          text: 'Lütfen şikayetinizi yazın',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor:'#FF9800',
          textColor:'white',
        });
        return false;
      }

      const post = await LocationAPI.post('/api/complaint', {
        branch_id:BranchStore.branchID,
        user_name:AuthStore.getNameSurname,
        user_phone:AuthStore.getPhoneNumber,
        user_id:AuthStore.getUserID,
        order:`Sipariş - #${this.state.selectedOrder.vi}`,
        order_id:this.state.selectedOrder._id,
        complaint:this.state.complaint
      });

      if(post.status == 200){
        Snackbar.show({
          text: 'Şikayetiniz ile en kısa sürede ilgileneceğiz',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor:'#4CAF50',
          textColor:'white',
        });
      }else{
        Snackbar.show({
          text: 'Beklenmedik hata (CSP41)',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor:'#d32f2f',
          textColor:'white',
        });
      }

    }catch(e){
      console.log(e);
    }

  }

  render() {
    return (
        <View style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Spinner
              visible={this.state.loading}
              size={'small'}
          />
          <Formik
              initialValues={{
                complaint:'',
                order:''
              }}
              onSubmit={this._handleSubmit}
          >
            {({values, setFieldValue, handleChange, touched, setFieldTouched, errors, handleSubmit, isSubmitting}) => (
                <View style={styles.inputFormArea}>

                  <View style={styles.inputs}>
                    <Text style={styles.inputInfoArea}>İlgili sipariş {(!!errors.order) ? <Text style={{color:'red'}}>*</Text> : <></>}  </Text>
                    <Item
                        style={styles.inputAreaForPicker}>
                      <RNPickerSelect
                          onValueChange={async (value) => {
                            this.setState({selectedOrder:value,});
                            console.log(value)
                            setFieldValue('order', value);
                          }}
                          style={pickerStyle}
                          value={values.order}
                          items={this.props.navigation.getParam('orders')}
                          placeholder={{label: 'Bir sipariş seçin'}}
                          doneText={'Tamam'}
                      />
                    </Item>

                  </View>

                  <View style={styles.inputs}>
                    <View style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                      <Text style={styles.inputInfoArea}>Şikayet</Text>
                    </View>
                    <Textarea
                        onChangeText={(val) => {

                          this.setState({
                            complaint:val,
                          });

                         // setFieldValue('complaint', val);

                        }}
                        rowSpan={1}
                        style={[styles.input, styles.inputArea, {zIndex:9, height:200, color:'#304555', paddingTop:6, paddingRight:5}]}
                    />
                  </View>

                  <Button
                      onPress={handleSubmit}
                      style={{borderRadius:8, marginTop:20, marginBottom:10, height:38, backgroundColor:'#7FB7EA', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>

                    {isSubmitting && <ActivityIndicator /> }
                    {!isSubmitting && <Text style={{color:'#fff', fontFamily:'Muli-ExtraBold'}}>Gönder</Text>}

                  </Button>


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
    fontFamily:'Muli-Bold'
  },
  inputAndroid: {
    minWidth:'106%',
    color:'#000',
    fontFamily:'Muli-Bold',
    marginTop:-15,
    marginLeft:-10
  },
})

const styles = StyleSheet.create({
  inputAreaForPicker:{
    borderColor:'#fff',
    paddingHorizontal:13,
    paddingTop:11,
    height:40,
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
    width:'100%',
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
