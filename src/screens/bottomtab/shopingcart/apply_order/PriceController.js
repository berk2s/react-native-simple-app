import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class PriceController extends Component {

    componentDidMount() {
        this.props.navigation.navigate('ShopingCard_');
    }

    render() {
    return (
      <View></View>
    );
  }
}

const styles = StyleSheet.create({});
