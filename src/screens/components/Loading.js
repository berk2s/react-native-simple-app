import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';

import ALogo from '../../img/alogo.png';
import MLogo from '../../img/mlogo.png';

export default class Loading extends Component {

    state = {
        rotate: new Animated.Value(0)
    }

    componentDidMount() {

        Animated
            .loop(
                Animated.sequence([
                    Animated.timing(this.state.rotate, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.linear,
                        userNativeDriver: true,
                    }),


                ])
            )
            .start();

    }

    render() {
        const spin = this.state.rotate.interpolate({
            inputRange:[0,1],
            outputRange:['0deg', '360deg']
        });
        const animatedStyle = {
            transform: [
                {
                    rotate: spin
                }
            ]
        }
    return (
      <View>
          <Animated.Image
              source={ALogo}
              style={[styles.alogo, animatedStyle]}
          />
          <Image
              source={MLogo}
              style={styles.mlogo}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({

    alogo:{
        width:96,
        height:89
    },
    mlogo:{
        width:42,
        height:34,
        position:'absolute',
        top:28,
        left:26
    }
});
