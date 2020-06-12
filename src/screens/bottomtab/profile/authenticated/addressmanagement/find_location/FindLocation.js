import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity } from 'react-native';

import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import Ripple from 'react-native-material-ripple';


export default class FindLocation extends Component {

    state = {
        region: null,

        selected_ltd:null,
        selected_lng:null

    }

    componentDidMount = async () => {

        try {
            Geolocation.getCurrentPosition(info => {
                this.setState({
                    region: {
                        latitude: (info.coords.latitude),
                        longitude: (info.coords.longitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                    selected_ltd: (info.coords.latitude),
                    selected_lng: (info.coords.longitude),
                });
            });
        }catch(e){
            console.log('e' + e)
        }

    }

    _handleNextClick = async () => {
        try{
            this.props.navigation.navigate('AddAddress', {selected_ltd:this.state.selected_ltd, selected_lng:this.state.selected_lng, provinces: this.props.navigation.getParam('provinces')});
        }catch(e){
            console.log(e);
        }
    }

    render() {
    return (
        <>
        <MapView
            style={{flex:1}}
            region={this.state.region}>
            <Marker draggable
                    coordinate={this.state.region}
                    onDragEnd={(e) => {
                        this.setState({
                            selected_ltd:e.nativeEvent.coordinate.latitude,
                            selected_lng:e.nativeEvent.coordinate.longitude,
                        });
                    }}
            />
        </MapView>
        <View style={styles.custom}>

            <Ripple style={styles.btn} onPress={this._handleNextClick}>
                <Text style={styles.btnText}>İlerle</Text>
            </Ripple>

        </View>
            <View style={styles.custom2}>

                <Ripple style={styles.btn2} onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.btnText2}>Geri</Text>
                </Ripple>

            </View>
            <View style={styles.custom3}>
                <Text style={styles.helperText}>Konumu doğru belirtmek için pini sürükleyebilirsiniz</Text>
            </View>
        </>
    );
  }
}

const styles = StyleSheet.create({
    helperText:{
      fontFamily:'Muli-Regular'
    },
    custom3:{
        position:'absolute',
        bottom:15,
        left:20
    },
    btn2:{
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#304555',
        width:150,
        height:40,
        borderRadius:10,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    btnText2:{
        fontFamily:'Muli-Bold',
        color:'#304555',
        fontSize:15
    },
    btnText:{
      fontFamily:'Muli-Bold',
      color:'#fff',
      fontSize:15
    },
    custom:{
        position:'absolute',
        bottom:40,
        right:20
    },
    custom2:{
        position:'absolute',
        bottom:40,
        left:20
    },

    btn:{
        backgroundColor:'#304555',
        width:150,
        height:40,
        borderRadius:10,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
});
