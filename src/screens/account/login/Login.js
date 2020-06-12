import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import Logo from '../../../img/logo.png';

import {Container, Header, Content, Form, Item, Input} from 'native-base';

import LoginForm from './LoginForm';


export default class Login extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Content style={styles.subContainer}>
          <View style={styles.logoArea}>
            <Image style={styles.image} source={Logo} />
          </View>
          <View style={styles.textArea}>
            <Text style={styles.text}>Giriş yapın</Text>
          </View>
          <LoginForm {...this.props} />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  helperTextArea:{
    display:'flex',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:32
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
    height:'100%'
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
