import React, { Component } from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomIcon from '../../../../../font/CustomIcon';
import Ripple from 'react-native-material-ripple';
import API from '../../../../../api';
import Snackbar from 'react-native-snackbar';
import {inject, observer} from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import {Input, Item} from 'native-base';

@inject('ShoppingListStore','AuthStore')
@observer
export default class SubProducts extends Component {

    state = {
        price:this.props.item.product_list_price,
        list_name:this.props.item.product_name,
        invalid:false,
        close:false,
        relevantProduct:[],
        loading:false,
        prepare:false,
        loadingList:false,
        listName:''
    }

    componentDidMount = async () => {

        try{


            const productID = this.props.item.id;

            const checkProduct = await API.get(`/api/product/get/${productID}`);

            if(checkProduct.data.status.code == 'EE_1' ){

                this.setState({
                    invalid:true,
                    list_name:this.props.item.product_name,
                    price:this.props.item.product_list_price,
                });

//asd
            }else if(checkProduct.data.status.code == 'FP_1'){

                if(checkProduct.data.data == null){
                    this.setState({
                        invalid:true,
                        list_name:this.props.item.product_name,
                        price:this.props.item.product_list_price,
                    });
                }else {
                    this.setState({
                        price: checkProduct.data.data.product_discount != null ? checkProduct.data.data.product_discount_price : checkProduct.data.data.product_list_price,
                        list_name: checkProduct.data.data.product_name,
                        relevantProduct: checkProduct.data.data
                    });
                }


            }else {

                this.setState({
                    close: true,
                });

            }




        }catch(e){
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            this.setState({
                loading:false,
            });
            return false;
        }


    }

    _handleIncreaseProduct = async () => {
        try{
            if(parseInt(this.props.item.count) < parseInt(this.state.relevantProduct.product_amonut)){
                this.setState({
                    loading:true,
                });

                const update = await API.put(`/api/user/shoppinglist/product`, {
                    user_id: this.props.AuthStore.getUserID,
                    shopping_id: this.props.listid,
                    products:this.props.ShoppingListStore.getShoppingList.filter(e => e._id == this.props.listid)[0].products
                }, {
                    headers: {
                        'x-access-token': this.props.AuthStore.getToken
                    }
                });

                await this.props.ShoppingListStore.increaseProduct(this.props.listid, this.state.relevantProduct._id);


                if(update.data.status.code == 'EE_1'){
                    Snackbar.show({
                        text: 'Houston! We got a problem! EUSP_372',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#aacfcf',
                        textColor: 'white',
                    });
                    return false
                }


                setTimeout(() => {
                    this.setState({
                        loading:false,
                    });
                }, 700)

            }else{
                Snackbar.show({
                    text: `Bu üründen en fazla ${this.state.relevantProduct.product_amonut} tane alabilirsiniz`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: '#aacfcf',
                    textColor: 'white',
                });
            }
        }catch(e){
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            this.setState({
                loading:false,
            });
            return false;
        }

    }

    _handleDecreaseProduct = async () => {
        try{




            if(parseInt(this.props.item.count) > 1){
                this.setState({
                    loading:true,
                });

                const update = await API.put(`/api/user/shoppinglist/product`, {
                    user_id: this.props.AuthStore.getUserID,
                    shopping_id: this.props.listid,
                    products:this.props.ShoppingListStore.getShoppingList.filter(e => e._id == this.props.listid)[0].products
                }, {
                    headers: {
                        'x-access-token': this.props.AuthStore.getToken
                    }
                });

                await this.props.ShoppingListStore.decreaseProduct(this.props.listid, this.state.relevantProduct._id);


                if(update.data.status.code == 'EE_1'){
                    Snackbar.show({
                        text: 'Houston! We got a problem! EUSP_3723',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#aacfcf',
                        textColor: 'white',
                    });
                    return false
                }

                setTimeout(() => {
                    this.setState({
                        loading:false,
                    });
                }, 700)
            }






        }catch(e){
            Snackbar.show({
                text: 'Üzgünüz, bir hata ile karşılaşıldı.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor:'#ff6363',
                textColor:'white',
            });
            this.setState({
                loading:false,
            });
            return false;
        }

    }

    _removeProduct = async () => {
        Alert.alert(
            'İşlemi onaylıyor musunuz',
            'Ürünü listeden çıkartmak için emin misiniz',
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

                            const myPromise = new Promise((resolve, reject) => {
                                this[RBSheet].close();
                            });

                            await Promise.all(myPromise);

                            const countOf = await this.props.ShoppingListStore.productCount(this.props.listid);
                            if(countOf == 1){
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


                            }else{

                                const update = await API.put(`/api/user/shoppinglist/product`, {
                                    user_id: this.props.AuthStore.getUserID,
                                    shopping_id: this.props.listid,
                                    products:this.props.ShoppingListStore.getShoppingList.filter(e => e._id == this.props.listid)[0].products
                                }, {
                                    headers: {
                                        'x-access-token': this.props.AuthStore.getToken
                                    }
                                });
                                await this.props.ShoppingListStore.removeProduct(this.props.listid, this.state.relevantProduct._id);

                                if(update.data.status.code == 'EE_1'){
                                    Snackbar.show({
                                        text: 'Houston! We got a problem! EUSP_37234',
                                        duration: Snackbar.LENGTH_LONG,
                                        backgroundColor: '#aacfcf',
                                        textColor: 'white',
                                    });
                                    return false
                                }

                            }





                            setTimeout(() => {
                                this.setState({
                                    loading:false,
                                });
                            }, 700)

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
                            }, 700)
                            return false;
                        }
                    }
                },
            ]
        );
    }

    render() {
        const isDeactive = this.state.invalid == true ? {opacity:0.2, backgroundColor:'rgba(48, 57, 96, 0.1)'} : {}
    return (
        <View>
            <View style={[styles.productCard, isDeactive]}>
                <View style={styles.productInfos}>
                    <Text style={{fontFamily:'Muli-Regular'}}>{this.state.list_name}</Text>
                    <Text style={{fontFamily:'Muli-Bold'}}>{this.state.price} <Text style={{fontFamily:'Arial', fontSize:12}}>₺</Text> - {this.props.item.count} adet</Text>
                </View>
                {
                    (this.state.invalid == false && this.state.close == false) && <TouchableOpacity
                        onPress={() => this[RBSheet].open()}
                        style={{width:35, height:35, display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                        <CustomIcon
                            name="edit-2"
                            size={18}
                            style={{color: '#616161'}}
                        />
                    </TouchableOpacity>
                }

            </View>




            <RBSheet ref={ref => {
                    this[RBSheet] = ref;
                }}
                closeOnDragDown={true}
                closeOnPressBack={true}
                openDuration={250}
                animationType={'fade'}
                height={130}
                customStyles={{
                    wrapper: {
                        //         minHeight:80
                    },
                    draggableIcon: {
                        backgroundColor: "#304555"
                    },
                    container:{
                        paddingHorizontal:20,
                        backgroundColor:'#fff',
                    }
                }}

            >
                <View>
                    <Spinner
                        visible={this.state.loading}
                        animation={'fade'}
                        size={'small'}
                    />
                    <Text style={{fontFamily:'Muli-Bold'}}>{this.state.list_name}</Text>

                    <View style={{
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'center',
                        width:'100%',
                        height:105,
                        bottom:20
                    }}>
                        <View style={{
                            height:35,
                            width:100,
                            display:'flex',
                            flexDirection:'row',

                            alignItems:'center'
                        }}>
                            <View style={{ width:100, display:'flex', flexDirection:'row', alignItems:'center'}}>

                                <View style={{}}>
                                    <TouchableOpacity
                                        onPress={this._handleDecreaseProduct}
                                        style={{height:45, width:30, display:'flex', justifyContent:'center', }}>
                                        <Text style={{fontFamily:'Muli-SemiBold', fontSize:25, color:'#304555'}}>-</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.count}><Text style={{color:'#fff', fontFamily:'Muli-Bold'}}>{this.props.item.count}</Text></View>
                                <View>
                                    <TouchableOpacity
                                        onPress={this._handleIncreaseProduct}
                                        style={{height:45, width:30, display:'flex', alignItems:'flex-end',justifyContent:'center', }}>
                                        <Text style={{fontFamily:'Muli-SemiBold', fontSize:25, color:'#304555'}}>+</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                        <Ripple
                            onPress={this._removeProduct}
                            rippleCentered={true}
                            rippleContainerBorderRadius={2}
                            rippleOpacity={0.1}
                            rippleDuration={500}
                            style={{borderRadius:2, backgroundColor:'#B2EBF2', height:28, width:62, display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontFamily:'Muli-Regular', fontSize:12, color:'#757575'}}>Çıkart</Text>
                        </Ripple>
                    </View>


                </View>
            </RBSheet>
        </View>
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
        paddingBottom:5,
        marginBottom:20
    },
});
