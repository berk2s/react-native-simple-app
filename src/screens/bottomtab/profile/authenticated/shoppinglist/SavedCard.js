import React, { Component } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    FlatList, Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomIcon from '../../../../../font/CustomIcon';
import Ripple from 'react-native-material-ripple';
import DownIMG from '../../../../../img/downarrow.png';
import RBSheet from 'react-native-raw-bottom-sheet';
import SubProducts from './SubProducts';
import Spinner from 'react-native-loading-spinner-overlay';
import {inject, observer} from 'mobx-react';
import API from '../../../../../api';
import Snackbar from 'react-native-snackbar';
import {Input, Item} from 'native-base';
import NavigationService from '../../../../../NavigationService';

@inject('ShoppingListStore','AuthStore')
@observer
export default class SavedCard extends Component {
    state = {
        loading:false,
        animatedHeight:new Animated.Value(0),
        animatedHeight2:new Animated.Value(0),
        text:'fazla',
        display:'none',
        isOn:false,
        loadingList:false,
        listName:this.props.item.list_name,
        totalPrice:0,
        priceCalc:false
    }

    startMore = async () => {


        Animated.timing(
            this.state.animatedHeight,
            {
                toValue: this.state.animatedHeight._value > 0 ? 0 : 1,
                duration:1,
               // easing:Easing.in
            }
        ).start();

        Animated.timing(
            this.state.animatedHeight2,
            {
                toValue: this.state.animatedHeight._value > 0 ? 0 : 1,
                duration:500,
               // easing:Easing.in
            }
        ).start();

    }

    _handleRemoveList = async () => {
        try{
            Alert.alert(
                'İşlemi onaylıyor musunuz',
                'Listeyi silmek istediğinizden emin misiniz?',
                [
                    {
                        text: 'Hayır',
                        style: 'cancel',
                    },
                    {   text: 'Evet',
                        onPress: async () => {

                            try{
                                this.setState({
                                    loading:true,
                                });

                                const removeList = await API.delete(`/api/user/shoppinglist/${this.props.AuthStore.getUserID}/${this.props.listid}`, {
                                    headers:{
                                        'x-access-token': this.props.AuthStore.getToken
                                    }
                                });

                                if(removeList.data.status.code == 'EE_1'){
                                    Snackbar.show({
                                        text: 'Houston! We got a problem! EUSP_3729',
                                        duration: Snackbar.LENGTH_LONG,
                                        backgroundColor: '#aacfcf',
                                        textColor: 'white',
                                    });
                                    return false
                                }else if(removeList.data.status.code == 'DS_1'){
                                    Snackbar.show({
                                        text: 'Listeniz kaldırıldı',
                                        duration: Snackbar.LENGTH_LONG,
                                        backgroundColor: '#aacfcf',
                                        textColor: 'white',
                                    });
                                    await this.props.ShoppingListStore.removeSavedList(this.props.listid);

                                }


                                setTimeout(() => {
                                    this.setState({
                                        loading:false,
                                    });
                                }, 500);
                            }catch(e){
                                Snackbar.show({
                                    text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                                    duration: Snackbar.LENGTH_LONG,
                                    backgroundColor:'#ff6363',
                                    textColor:'white',
                                });
                                setTimeout(() => {
                                    this.setState({
                                        loading:false,
                                    });
                                }, 500);
                                return false;
                            }




                        }}])
        }catch(e){
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            setTimeout(() => {
                this.setState({
                    loading:false,
                });
            }, 500);
            return false;
        }
    }

    _handleChangeName = async () => {
        try {
            Keyboard.dismiss();
            if(this.state.loadingList == false) {
                this.setState({
                    loadingList: true,
                });
                if (this.state.listName.trim() == '') {
                    Snackbar.show({
                        text: 'Bir liste ismi girmeniz gerekli',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#aacfcf',
                        textColor: 'white',
                    });
                    setTimeout(() => {
                        this.setState({
                            loadingList: false,
                        });
                    }, 500)
                    return false;
                }

                if(this.state.listName.trim().length < 2){
                    Snackbar.show({
                        text: 'Biraz daha uzun isim yazınız',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#aacfcf',
                        textColor: 'white',
                    });
                    setTimeout(() => {
                        this.setState({
                            loadingList: false,
                        });
                    }, 500)
                    return false;
                }

                if(this.state.listName.trim().length > 25){
                    Snackbar.show({
                        text: 'Biraz daha kısa isim yazınız',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#aacfcf',
                        textColor: 'white',
                    });
                    setTimeout(() => {
                        this.setState({
                            loadingList: false,
                        });
                    }, 500)
                    return false;
                }

                const userID = this.props.AuthStore.getUserID;
                const listName = this.state.listName.trim();

                const checkName = await API.post(`/api/user/shoppinglist/check2`, {
                    user_id: userID,
                    list_name: listName,
                }, {
                    headers: {
                        'x-access-token': this.props.AuthStore.getToken
                    }
                });



                if (checkName.data.state.code == 'CS_0') {
                    Snackbar.show({
                        text: checkName.data.data,
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#aacfcf',
                        textColor: 'white',
                    });
                    setTimeout(() => {
                        this.setState({
                            loadingList: false,
                        });
                    }, 500)
                    return false
                }

                const saveList = await API.put(`/api/user/shoppinglist/name`, {
                    user_id: this.props.AuthStore.getUserID,
                    list_name: this.state.listName.trim(),
                    shopping_id:this.props.listid
                }, {
                    headers: {
                        'x-access-token': this.props.AuthStore.getToken
                    }
                });


                if(saveList.data.status.code == 'EE_1'){
                    Snackbar.show({
                        text: 'Beklenmedik bir hata oluştu. ESL_EE0',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#aacfcf',
                        textColor: 'white',
                    });
                    setTimeout(() => {
                        this.setState({
                            loadingList: false,
                        });
                    }, 500)
                    return false;
                }

                await this.props.ShoppingListStore.changeListName(this.props.listid, this.state.listName.trim())

                Snackbar.show({
                    text: 'Liste ismi değiştirildi',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: '#79d70f',
                    textColor: 'white',
                });


                setTimeout(() => {
                    this[RBSheet].close();
                    this.setState({
                        loadingList: false,
                    });
                }, 500)
            }


            return true;
        }catch(e){
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            setTimeout(() => {
                this.setState({
                    loadingList: false,
                    loading:false
                });
            }, 500)
            return false;
        }

    }

    _applyList = async () => {
        try{
            Alert.alert(
                'Listeyi uygula',
                'Listeyi uygularsanız sepetteki ürünleri silersiniz',
                [
                    {
                        text: 'İptal',
                        style: 'cancel',
                    },
                    {
                        text: 'Uygula',
                        onPress: async () => {
                            this.setState({
                                loading:true,
                            });

                            await this.props.ShoppingListStore.applyList(this.props.listid);

                            setTimeout(() => {
                                NavigationService.navigate('ShopingCard_')
                                this.setState({
                                    loading:false,
                                });
                            }, 1200);

                        }
                    }])
        }catch(e){
            console.log(e);
        }
    }

    render() {
        const heightAnimated = this.state.animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
        });

        const downRotate = this.state.animatedHeight2.interpolate({
            inputRange: [0,1],
            outputRange: ['0deg', '180deg']
        });
        const downRotate2 = this.state.animatedHeight.interpolate({
            inputRange: [0,1],
            outputRange: [0, 1]
        });

        const animatedStyle = {
            transform: [
                {
                    rotate: downRotate
                }
            ]
        }
    return (
        <View style={[styles.shoppingListCard]}>
            <Spinner
                visible={this.state.loading}
                size={'small'}
            />
            <View style={styles.cardHeaderArea}>
                <CustomIcon name="star-fill" size={18} color={'#304555'} />
                <Text style={styles.headerTitle}>{this.props.item.list_name}</Text>
                <Ripple
                    rippleCentered={true}
                    rippleContainerBorderRadius={2}
                    rippleOpacity={0.1}
                    rippleDuration={500}
                    onPress={this._applyList}
                    style={{borderRadius:2, backgroundColor:'#B2EBF2', height:25, width:72, display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontFamily:'Muli-Regular', fontSize:12, color:'#757575'}}>Kullan</Text>
                </Ripple>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardInfoText}>{this.props.item.products.length } ürün</Text>



            </View>
            <View style={styles.cardBottom}>
                <Ripple
                    rippleDuration={600}
                    rippleColor={'#BDBDBD'}
                    rippleContainerBorderRadius={5}
                    style={styles.down}
                    onPress={async () => {

                        if(this.state.isOn == false) {
                            this.setState({
                                isOn: true,
                                loading: true
                            });


                            setTimeout(async () => {
                                await this.startMore();
                            }, 100)


                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                });
                                if (this.state.text === 'fazla') {
                                    this.setState({
                                        text: 'az',
                                        display: 'flex'
                                    });
                                } else {
                                    this.setState({
                                        text: 'fazla',
                                        display: 'none'
                                    });
                                }
                                this.setState({
                                    isOn: false,
                                });
                            }, 700)



                        }




                    }}
                >
                    <Text style={{fontFamily:'Muli-Bold'}}>Daha {this.state.text}</Text>
                    <Animated.Image source={DownIMG} style={[animatedStyle ,{width:16, height:16}]} />
                </Ripple>

            </View>

            <View style={[{overflow:'hidden'}, {display: this.state.display}]}>

                <Animated.View style={[styles.productList, ]}>

                    <FlatList
                        data={this.props.item.products}
                        renderItem={({item}) => <SubProducts item={item} hisLenght={this.props.item.products.length} listid={this.props.listid} />}
                        keyExtractor={item => item._id+''+Math.random()}
                    />

                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <Ripple
                            onPress={this._handleRemoveList}
                            rippleCentered={true}
                            rippleContainerBorderRadius={2}
                            rippleOpacity={0.1}
                            rippleDuration={500}
                            style={{marginBottom:12, borderRadius:2, borderWidth:1, borderColor:'#B2EBF2', height:35, width:'45%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontFamily:'Muli-Regular', fontSize:12, color:'#757575'}}>Listeyi sil</Text>
                        </Ripple>

                        <Ripple
                            rippleCentered={true}
                            rippleContainerBorderRadius={2}
                            rippleOpacity={0.1}
                            rippleDuration={500}
                            onPress={() => {
                                this[RBSheet].open()
                            }}
                            style={{marginBottom:12, borderRadius:2, backgroundColor:'#B2EBF2', height:35, width:'45%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontFamily:'Muli-Regular', fontSize:12, color:'#757575'}}>İsmi düzenle</Text>
                        </Ripple>
                    </View>


                </Animated.View>

            </View>

            <RBSheet
                ref={ref => {
                    this[RBSheet] = ref;
                }}
                closeOnDragDown={true}
                closeOnPressBack={true}
                openDuration={250}
                animationType={'fade'}
                height={170}
                customStyles={{
                    wrapper:{
                        zIndex:1,
                    },
                    draggableIcon: {
                        backgroundColor: "#304555"
                    },
                    container:{
                        paddingHorizontal:20,
                        backgroundColor:'#fff',
                        borderTopLeftRadius:18,
                        borderTopRightRadius:18
                    }
                }}

            >


                <View>
                    <Text style={{fontFamily:'Muli-Bold', fontSize:16, textAlign:'center'}}>Listeyi düzenle</Text>

                    <View style={{
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                        justifyContent:'center',
                        width:'100%',
                        marginVertical:20
                    }}>

                        <Item
                            style={styles.inputArea}>

                            <View style={{paddingLeft:10}}>
                                <Text style={styles.accIcon}>
                                    <CustomIcon
                                        name="star-fill"
                                        size={18}
                                        style={{color: '#616D7B'}}
                                    />
                                </Text>
                            </View>

                            <Input
                                style={[styles.input, {zIndex:9}]}
                                placeholder={'Liste ismi'}
                                placeholderTextColor={'#bdbdbd'}
                                onChangeText={(val) => {
                                    this.setState({
                                        listName: val,
                                    });
                                }}
                                value={this.state.listName}
                            />
                        </Item>

                        <View style={{marginTop:22, width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>

                            <Ripple
                                rippleCentered={true}
                                rippleContainerBorderRadius={2}
                                rippleOpacity={0.1}
                                rippleDuration={500}
                                onPress={() => {

                                    setTimeout(() => {
                                        this[RBSheet].close()
                                    },200)
                                }}
                                style={[styles.dotChoice, {backgroundColor:'#fff', borderWidth:1, borderColor:'#B2EBF2'}]}>
                                <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Vazgeç</Text>
                            </Ripple>

                            <Ripple
                                rippleCentered={true}
                                rippleContainerBorderRadius={2}
                                rippleOpacity={0.1}
                                rippleDuration={500}
                                style={styles.dotChoice}
                                onPress={this._handleChangeName}

                            >
                                {this.state.loadingList == true ? <ActivityIndicator /> : <Text style={{fontFamily:'Muli-Bold', fontSize:12, color:'#757575'}}>Değiştir</Text>}
                            </Ripple>

                        </View>

                    </View>


                </View>


            </RBSheet>

        </View>
    );
  }
}

const styles = StyleSheet.create({
    dotChoice:{
        borderRadius:2,
        backgroundColor:'#B2EBF2',
        height:35,
        width:'45%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    input:{
        fontFamily:'Muli-SemiBold',
        fontSize:13,
        paddingLeft:10,
    },
    inputArea:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:35,
        width:'100%',
        backgroundColor:'#f4f6ff',
        borderRadius:8,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 0.5,
    },
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
        //minHeight:0,
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
        justifyContent:'space-between',
        alignItems:'center',
        height:50,
        paddingHorizontal: 10
    },
    headerTitle:{
        fontFamily:'Muli-Bold',
        fontSize:14,
        paddingLeft:5,
        width:'70%'
    },
    cardHeaderArea:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        width:'100%',
        paddingHorizontal: 8,
        height:20
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
