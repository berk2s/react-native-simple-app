import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import {inject, observer} from 'mobx-react';

@inject('BasketStore', 'ProductStore')
@observer
export default class RandomProducts extends Component {
  render() {
    return (
        <View style={{marginVertical:20, display:'flex', flexDirection:'column', alignItems:'center', width:'100%',}}>
            {this.props.ProductStore.randoms.map((e) => {
                const backgroundColorVar = {backgroundColor: this.props.BasketStore.getProducts.map(e => e.id).indexOf(e._id) === -1 ? 'transparent' : '#fff'};
                return <Ripple
                    rippleContainerBorderRadius={5}
                    rippleColor={'#ccc'}
                    rippleCentered={true}
                    rippleDuration={600}
                    rippleFades={true}
                    onPress={async () => {
                        this.setState({
                            loading: true,
                        });

                        if( this.props.BasketStore.getProducts.map(e => e.id).indexOf(e._id) === -1) {
                            await this.props.BasketStore.addToBasket(e._id);
                        }else{
                            await this.props.BasketStore.removeFromBasket(e._id);
                        }

                        this.setState({
                            loading: false,
                        });
                    }}
                    style={[styles.dotView, backgroundColorVar]} key={e._id}>
                    <Text style={styles.textStyle}>{e.product_name}</Text>
                </Ripple>

            })}
        </View>
    );
  }
}

const styles = StyleSheet.create({
    textStyle:{
        fontFamily:'Muli-Light',
        color:'#009688',
        textAlign:'center'
    },
    dotView:{
        display:'flex',
        minHeight:35,
        paddingHorizontal:15,
        marginLeft:5,
        marginRight:5,
        marginBottom:15,

        backgroundColor:'#B2EBF2',
        borderRadius:5,

        shadowColor: "#bdbdbd",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1,

        elevation: 0.5,

        justifyContent:'center',
        alignItems:'center'
    },
});
