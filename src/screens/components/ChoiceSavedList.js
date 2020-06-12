import React, { Component } from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import CustomIcon from '../../font/CustomIcon';
import Ripple from 'react-native-material-ripple';

import Spinner from 'react-native-loading-spinner-overlay';

import {inject, observer} from 'mobx-react';

@inject('ShoppingListStore','AuthStore')
@observer
export default class ChoiceSavedList extends Component {
    state ={
        loading:false
    }
  render() {
    return (
        <View>
            <Spinner
                visible={this.state.loading}
                animation={'fade'}
                size={'small'}
            />
      <Ripple
          rippleDuration={800}
          rippleOpacity={0.1}
          style={styles.listItemCard}
          onPress={async () => {
              this.setState({
                  loading:true,
              });

              await this.props.ShoppingListStore.applyList(this.props.item._id);

              setTimeout(() => {
                  this.props.rbmanage.close()
                  this.setState({
                      loading:false,
                  });
              }, 700);
          }}
      >
          <CustomIcon name="star-fill" size={16} color={'#003DFF'} style={{marginRight:10}}/>
          <View style={styles.actionArea}>
              <Text style={{fontFamily:'Muli-Regular', width:'100%', height:'100%'}}>{this.props.item.list_name}</Text>
          </View>
      </Ripple>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    dotChoice:{
        borderRadius:2,
        backgroundColor:'#B2EBF2',
        height:35,
        width:50,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    actionArea:{
      width:'90%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems: 'center',

    },
    listItemCard:{
        paddingHorizontal:10,
      display:'flex',
      flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        height:50,
        backgroundColor:'#f1fcfc',
        marginBottom:10,
        shadowColor: "#eee",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 0.5,
    },
});
