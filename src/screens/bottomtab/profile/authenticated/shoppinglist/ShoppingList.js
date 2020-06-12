import React, { Component } from 'react';
import {
    Dimensions,
    Easing,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EmptyHeader from '../../../../components/EmptyHeader';
import CustomIcon from '../../../../../font/CustomIcon';
import {Content, Title} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import Ripple from 'react-native-material-ripple';

import QuestionIMG from '../../../../../img/question.png';
import DownIMG from '../../../../../img/downarrow.png';

import {SafeAreaView} from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import BasketStore from '../../../../../store/BasketStore';
import SavedCard from './SavedCard';
import {inject, observer} from 'mobx-react';
import EmptyIMG___ from '../../../../../img/checklist.png';

@inject('ShoppingListStore')
@observer
export default class ShoppingList extends Component {

    state = {
        loading: false,
    }

    render() {


    return (
        <SafeAreaView style={[styles.container, {backgroundColor:'#F6F6F6', display:'flex', flex:1}]}>
            <EmptyHeader>
                <View style={{marginRight:30}}>
                    <TouchableOpacity style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end'}} onPress={() => this.props.navigation.goBack(null)}>
                        <CustomIcon name="arrow-left" size={28} style={{color:'#003DFF', marginTop:2}} />
                    </TouchableOpacity>
                </View>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Title style={{fontFamily:'Muli-ExtraBold', color:'#003DFF'}}>Alışveriş listelerim</Title>
                </View>
            </EmptyHeader>
            <Spinner
                visible={this.state.loading}
                animation={'fade'}
                size={'small'}
            />

            <View
                style={{paddingHorizontal:12, height:'100%'}}
                padder>

                <View style={styles.infoarea}>
                    <Text style={styles.infoText}><Image source={QuestionIMG} style={{width:16, height:16}} />  Sepete eklediğiniz ürünleri liste oluşturup zaman kazanabilirsiniz</Text>
                </View>

                <View style={styles.shoppingListArea}>

                    <FlatList
                        data={this.props.ShoppingListStore.getShoppingList}
                        renderItem={({item}) => <SavedCard  item={item} listid={item._id} />}
                        ListFooterComponent={() => <View style={{height:100}}></View>}
                        ListEmptyComponent={() => (

                            <View style={{display:'flex',height:Dimensions.get('window').height-240, justifyContent:'center', alignItems:'center'}}>
                                <Image source={EmptyIMG___} style={{width:80, height:80}}/>
                                <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:20, color:'#304555'}}>Kayıtlı listen yok</Text>

                            </View>

                        )}
                        keyExtractor={item => item._id}
                    />

                </View>



            </View>

        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    count:{
        width:23,
        height:23,
        backgroundColor:'#00CFFF',
        borderRadius:3,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:5
    },
    productInfos:{
      width:'88%'
    },
    productCard:{
      minHeight:40,
      display:'flex',
      flexDirection:'row',
        justifyContent:'space-between',
    //  alignItems:'center',
        paddingTop:5,
        marginBottom:20
    },
    productList:{
      display:'flex',
      flexDirection:'column',
      paddingHorizontal:10,
        marginTop:10,
    },
    down:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:40,
        paddingHorizontal: 10,
    },
    cardBottom:{
      borderTopWidth:0.3,
        borderTopColor:'#9E9E9E',
       // height:40,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',

    },
    cardInfoText:{
        fontFamily:'Muli-Regular',
        fontSize: 13,
        color:'#304555'
    },
    cardBody:{
      display:'flex',
       flexDirection:'row',
        alignItems:'center',
        height:40,
        paddingHorizontal: 10
    },
    headerTitle:{
      fontFamily:'Muli-Bold',
        fontSize:14,
      paddingLeft:5,
        width:'90%'
    },
    cardHeaderArea:{
      display:'flex',
      flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        width:'100%',
        paddingHorizontal: 10
    },
    shoppingListCard:{
        display:'flex',
        flexDirection:'column',
        backgroundColor:'#f4f6ff',
        width:'100%',
        borderRadius:5,
        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.70,
        shadowRadius: 3,
        elevation:0.5,
        paddingTop: 10,
        paddingBottom:0,

        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,

        marginBottom:40,

    },
    shoppingListArea:{
      marginVertical:20  ,
        display:'flex',
        flexDirection:'column',
        width:'100%',
    },
    infoText:{
      fontFamily:'Muli-Regular',
      color:'#212121',
        width:'100%',

    },
    infoarea:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
        paddingVertical:12,
        paddingHorizontal:10,

        backgroundColor:'#B2EBF2',

        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.70,
        shadowRadius: 2,
        borderRadius:5
    },
    body:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        maxWidth:'84.9%'
    },
});
