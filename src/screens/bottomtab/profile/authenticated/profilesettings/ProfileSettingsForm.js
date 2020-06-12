import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomIcon from '../../../../../font/CustomIcon';
import {Body, Input, Item, Left, ListItem, Right, Switch} from 'native-base';

import {Formik} from 'formik'
import Spinner from 'react-native-loading-spinner-overlay';
import API from '../../../../../api';
import AuthStore from '../../../../../store/AuthStore';
import Snackbar from 'react-native-snackbar';
import {observer} from 'mobx-react';

@observer
export default class ProfileSettingsForm extends Component {

    state = {
        loading: false,
    }

    _handleBlurNameSurname = async (value) => {
        try{
            if(value.trim().length < 4){
                Snackbar.show({
                    text: 'Lütfen gerçekci isim girin',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor:'#d32f2f',
                    textColor:'white',
                });
                return false
            }

            this.setState({
                loading:true,
            });

            const name_surname = value;
            const update = await API.put(`/api/user/name`, {
                name_surname: name_surname,
                user_id: AuthStore.getUserID
            },{
                headers:{
                    'x-access-token': AuthStore.getToken
                }
            });

            await AuthStore.setNameSurname(name_surname);

            this.setState({
                loading:false,
            });

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

    _handleBlurPermissionEMAIL = async (value) => {
        try{
            this.setState({
                loading:true,
            });

            const update = await API.put(`/api/user/permission/email`, {
                value: value,
                user_id: AuthStore.getUserID
            }, {
                headers:{
                    'x-access-token': AuthStore.getToken
                }
            });

            this.setState({
                loading:false,
            });
        }catch(e){
            console.log(e)
        }
    }

    _handleBlurPermissionSMS = async (value) => {
        try{
            this.setState({
                loading:true,
            });

            const update = await API.put(`/api/user/permission/sms`, {
                value: value,
                user_id: AuthStore.getUserID
            },{
                headers:{
                    'x-access-token': AuthStore.getToken
                }
            });

            this.setState({
                loading:false,
            });
        }catch(e){
            console.log(e)
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
                name_surname: this.props.userInfo.name_surname,
                phone_number: this.props.userInfo.phone_number,
                email_address: this.props.userInfo.email_address,
                permission_email: this.props.userInfo.permission_email,
                permission_sms: this.props.userInfo.permission_sms
            }}
          >
              {({values, setFieldValue, handleChange}) => (
                  <View style={styles.inputFormArea}>
                      <View style={styles.inputs}>
                          <Text style={styles.inputInfoArea}>İsim ve soyisim</Text>
                          <Item
                              style={styles.inputArea}>
                              <Input
                                  style={[styles.input, {zIndex:9}]}
                                  value={values.name_surname}
                                  onChangeText={handleChange('name_surname')}
                                  onBlur={() => this._handleBlurNameSurname(values.name_surname)}
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

                      <View style={styles.inputs}>
                          <Text style={styles.inputInfoArea}>Telefon numarası</Text>
                          <Item
                              style={styles.inputArea}>
                              <Input
                                  style={[styles.input, {zIndex:9}]}
                                  value={values.phone_number}
                                  editable={false}
                              />

                          </Item>
                      </View>

                      <View style={styles.inputs}>
                          <Text style={styles.inputInfoArea}>E-Posta</Text>
                          <Item
                              style={styles.inputArea}>
                              <Input
                                  style={[styles.input, {zIndex:9}]}
                                  value={values.email_address}
                                  editable={false}
                              />

                          </Item>
                      </View>

                      <View style={styles.inputs}>
                          <Text style={styles.inputInfoArea}>İzinler</Text>

                          <ListItem icon style={{marginLeft: 5}}>
                              <Left>
                                  <CustomIcon
                                      name="edit-2"
                                      size={18}
                                      style={{color: '#616D7B'}}
                                  />
                              </Left>
                              <Body>
                                  <Text style={{fontFamily:'Muli-Regular'}}>E-Posta bildirimleri</Text>
                              </Body>
                              <Right>
                                  <Switch
                                      value={values.permission_email}
                                      onValueChange={(value) => {setFieldValue('permission_email', value), this._handleBlurPermissionEMAIL(value)}}
                                  />
                              </Right>
                          </ListItem>

                          <ListItem icon style={{marginLeft: 5}}>
                              <Left>
                                  <CustomIcon
                                      name="edit-2"
                                      size={18}
                                      style={{color: '#616D7B'}}
                                  />
                              </Left>
                              <Body>
                                  <Text style={{fontFamily:'Muli-Regular'}}>SMS bildirimleri</Text>
                              </Body>
                              <Right>
                                  <Switch
                                      value={values.permission_sms}
                                      onValueChange={(value) => {setFieldValue('permission_sms', value); this._handleBlurPermissionSMS(value)}}
                                  />
                              </Right>
                          </ListItem>

                      </View>
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
        marginVertical:15
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
        elevation:5,

        borderTopColor: 'transparent',

    },
});
