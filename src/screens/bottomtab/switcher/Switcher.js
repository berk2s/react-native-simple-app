import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {NavigationEvents} from 'react-navigation';
import SwitcherStore from '../../../store/SwitcherStore';
import {observer} from 'mobx-react';
import Ripple from 'react-native-material-ripple';

@observer
export default class Swicher extends Component {


    _handeClick = () => {
        this.props.clickEvent();
    }


  render() {
    return (
        <View style={styles.topContainer}>
            <View style={styles.container}>
                {
                    SwitcherStore.whichSwitcher == 0
                        ?
                        <View style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                            <View style={styles.box}>
                                <Text style={styles.activeText}>mavideniste</Text>
                            </View>
                            <Ripple style={styles.box} onPressIn={() => this._handeClick()}>
                                <Text style={styles.text}>mavikurye</Text>
                            </Ripple>
                        </View>
                        :
                        <>
                            <Ripple style={styles.box} onPress={() => this._handeClick()}>
                                <Text style={styles.text}>mavideniste</Text>
                            </Ripple>
                            <View style={styles.box}>
                                <Text style={styles.activeText}>mavikurye</Text>
                            </View>
                        </>
                }
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    text:{
      color:'#BCBCBC',
        fontFamily:'Muli-ExtraBold',
        fontSize:15,
    },
    box:{
        width:117,
        height:31,
        display:'flex',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#fff',
        borderRadius:20,
        marginHorizontal:5,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 7,
        elevation: 4,
    },
    activeText:{
      color:'#003DFF',
        fontFamily:'Muli-ExtraBold',
        fontSize:15,
    },
    container:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
    },
    topContainer:{
        position:'absolute',
        bottom:65,
        right:'50%',
        left:'50%',
        zIndex:1
    }
});
