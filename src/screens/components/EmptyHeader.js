import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomIcon from '../../font/CustomIcon';
import {Left, Title} from 'native-base';

export default class EmptyHeader extends Component {
    render() {
        return (
            <View style={typeof this.props.style !== 'undefined' ? this.props.style : styles.headerArea}>

                {this.props.children}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerArea:
        {paddingHorizontal:5, paddingVertical:13, display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems: 'center',}
});
