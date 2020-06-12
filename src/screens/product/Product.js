import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Animated,
    Platform,
    Easing,
    ActivityIndicator, FlatList,
} from 'react-native';
import HeaderWithSearch from '../components/HeaderWithSearch';
import { Container, Header, Button, Content, } from "native-base";
import API from '../../api';
import FastImage from 'react-native-fast-image';
import Loading from '../components/Loading';
import CustomIcon from '../../font/CustomIcon';

import {observer, inject} from 'mobx-react'
import Spinner from 'react-native-loading-spinner-overlay';
import {NavigationEvents} from 'react-navigation';

import ProductCard from '../components/ProductCard';
import HeaderForProducts from '../components/HeaderForProducts';
import EmptyIMG from '../../img/search_result.png';
import EmptyIMG2 from '../../img/sad.png';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ripple from 'react-native-material-ripple';
import OutOfWork from '../components/OutOfWork';
import BasketAmount from '../components/BasketAmount';
import RandomProducts from '../components/RandomProducts';

const HEADER_MAX_HEIGHT=Platform.OS === 'android' ? 55 : 55
const HEADER_MIN_HEIGHT=0
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT


const HEADER_MAX_HEIGHT1=28
const HEADER_MIN_HEIGHT1=0
const HEADER_SCROLL_DISTANCE1 = HEADER_MAX_HEIGHT1 - HEADER_MIN_HEIGHT1


@inject('BasketStore', 'ProductStore', 'BranchStore')
@observer
export default class ProductList extends Component {

    state = {
        loadingHeight: Dimensions.get('window').height-160,
        datas: [],
        fetched: false,
        loading: false,
        headerSeacrh:false,
        headerSearch:false,
        searchKey:null,
        searchResults:[],
        filter:false,
        filterSubIds:null,
        scrollY:new Animated.Value(0),
        bounces:true,
        isSearchFetched:false,
        sliceEnd:10,
        scrollYInt:0,
        refreshing:false,
        _data:[],
        dragY:0,
        scrollY_:0,
        offset:0,
        _extra: 'All'
    }

    componentDidMount = async () => {
        try{
            const category_id = this.props.navigation.getParam('category_id');
         //   await this.props.ProductStore.fetchProducts(category_id, this.props.BranchStore.branchID);

                this.setState({
                    fetched: true,
                    bounces: this.props.ProductStore.getProducts.length > 6
                });



            this.setState({
                _data_:this.props.ProductStore.getProducts
            });


        }catch(e){
            console.log(e);
        }
    }

    _handleSearchChange = (val) => {
        this.setState({
            loading:false,
        });

    }

    _handleOnBlur = async (val) => {
        try{
            if(val == null){
                this.setState({
                    loading: true
                });

                setTimeout(() => {
                    this.setState({
                        loading: false,
                        headerSearch: false,
                        searchResults:[],
                        isSearchFetched:false,
                        _extra:'All',
                        _data_: this.props.ProductStore.getProducts
                    });

                }, 500)
            }else {
                this.setState({
                    headerSearch: true,
                    loading: true,
                    searchKey:val,
                    filterSubIds:null
                });


                const searchPromise = new Promise(((resolve, reject) => {
                    const search = this.props.ProductStore.getProducts.filter(e => {
                        const productname = e.product_name.toUpperCase();
                        const text = val.trim().toUpperCase();

                        return productname.indexOf(text) > -1
                    });
                    resolve(search);
                }));

                const results_ = await searchPromise;
                this.setState({
                    _data_: results_,
                    searchResults:results_,
                });


                if(this.state._data_.length > 0){
                    this.flatListRef.scrollToIndex({ animated: false, index: 0 });
                }

                console.log(val.trim().toLowerCase())

              //  const category_id = this.props.navigation.getParam('category_id');

                //const results = await API.get(`/api/product/search/${this.props.BranchStore.branchID}/${category_id}/${val.trim()}`);

                //this.state.searchResults = [...results.data.data]

                //this.setState({
                //    bounces: this.state.searchResults > 6,
               // });


                setTimeout(() => {
                    this.setState({
                        loading:false,
                        isSearchFetched:true
                    });
                }, 100)



            }
        }catch(e){
            console.log(e);
        }
    }

    handleSubCategoryPress = async (sub_category_id, status) => {
        try{
            this.setState({
                loading:true,
            });


            if(this.state.filterSubIds !== sub_category_id) {

               // this.state.filterSubIds = (sub_category_id);

                setTimeout(() => {
                    this.setState({
                        filterSubIds : sub_category_id,
                        filter:true,
                        _extra: sub_category_id,
                        _data_: this.props.ProductStore.getProducts.filter(e => e.sub_category_id == sub_category_id)
                    });
                }, 100);

            }else {
               // this.state.filterSubIds = null;
                this.setState({
                    filterSubIds:null
                });

                setTimeout(() => {

                        this.setState({
                            filter:false,
                            extra: 'All',
                            _data_: this.props.ProductStore.getProducts
                        });

                }, 50);
            }

            setTimeout(() => {
                this.setState({
                    loading:false,
                    refreshing:false
                });
                if(this.state._data_.length > 0){
                    this.flatListRef.scrollToIndex({ animated: false, index: 0 });
                }
                this.setState({
                    refreshing:false,
                });

            }, 100)



        }catch(e){
            console.log(e);
        }
    }

    render() {
        let headerHeight;
        let headerHeight1;
        let inputHeight;



            headerHeight = this.state.scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
           //     extrapolate: 'clamp',
            });


        return (
            <SafeAreaView style={styles.container}>

                {this.state.fetched
                    ?
                    <Animated.View style={{overflow:'hidden', display:'flex', width:'100%', backgroundColor:'#f5f5f5', height:headerHeight}}>
                    <HeaderForProducts
                        onChange={this._handleSearchChange}
                        onBlur={this._handleOnBlur}
                        {...this.props}
                    />
                    </Animated.View>
                    :
                    <></>
                }

                {<BasketAmount/>}

                <View
                    ref={ref => this.content = ref}
                    style={{display:'flex', flex:1, marginBottom:-30, marginHorizontal:8}}
                    >

                    <View style={[styles.content, {display:'flex', }]}>
                        <Spinner
                            visible={this.state.loading}
                            animation={'fade'}

                            size={'small'}
                        />
                        {
                            <>
                                {this.state.headerSearch &&
                                <View style={[styles.searchResultArea, {marginBottom:15}]}>
                                    <View style={styles.searchInfoArea}>
                                        <Text
                                            style={styles.infoTexts}>{this.props.navigation.getParam('category_name')} içinde <Text
                                            style={styles.infoSearchText}>{this.state.searchKey}</Text> için sonuçlar
                                        </Text>
                                    </View>
                                </View>}
                            </>
                        }
                        {this.state.fetched
                            ?



                                    <View style={{flex:1}}>

                                        {
                                            !this.state.headerSearch && this.props.navigation.getParam('subcategories').length > 0 &&
                                            <View style={{}}>
                                        <ScrollView
                                            horizontal={true}
                                            contentContainerStyle={{
                                                display:'flex',
                                                justifyContent:'center',
                                                alignItems:'center',
                                                height:50
                                            }}>
                                            {
                                                this.props.navigation.getParam('subcategories').map((e, index) => {
                                                    const styleArray = [];
                                                    let lastRipple = {}
                                                    styleArray.push(styles.tag);
                                                    if (this.state.filterSubIds == (e._id)) {
                                                        styleArray.push(styles.selectedTag)
                                                    };
                                                    if(this.props.navigation.getParam('subcategories').length-1 == index){
                                                        lastRipple = {marginRight:0}
                                                    }
                                                    return <Ripple
                                                                    key={e._id}
                                                                   onPress={() => this.handleSubCategoryPress(e._id, this.state.filterSubIds)}
                                                                   rippleContainerBorderRadius={8} style={[styleArray, lastRipple]}>
                                                        <Text style={{
                                                            color: this.state.filterSubIds == e._id ? '#1BD4FE' : '#fff',
                                                            fontFamily: 'Muli-Bold',
                                                            fontSize: 13
                                                        }}>{e.sub_category_name}</Text>
                                                    </Ripple>
                                                })
                                            }
                                        </ScrollView>
                                            </View>
                                        }

                                        <View style={[styles.cardArea, {flex:1}]}>

                                            {
                                                        this.props.ProductStore.getProducts.length > 0
                                                            ?
                                                                <FlatList
                                                                    ref={ref => this.flatListRef = ref}
                                                                    numColumns={2}
                                                                   // initialNumToRender={5}
                                                                    ListEmptyComponent={() => (

                                                                        <View style={{display:'flex',height:Dimensions.get('window').height-180, justifyContent:'center', alignItems:'center'}}>
                                                                            <Image source={EmptyIMG} style={{width:80, height:80}}/>
                                                                            <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:20, color:'#304555'}}>Hiç ürün bulamadık</Text>
                                                                            <Text style={{fontFamily:'Muli-SemiBold', marginTop:5, fontSize:15, color:'#304555'}}>üzgünüz, en kısa sürede tedarik edeceğiz</Text>
                                                                            <RandomProducts />
                                                                        </View>

                                                                    )}
                                                                    columnWrapperStyle={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}
                                                                    data={
                                                                        this.state._data_
                                                                    }
                                                                    extraData={this.state._extra}
                                                                    renderItem={({item}) => <ProductCard key={item._id} e={item} {...this.props} />}
                                                                    keyExtractor={item => item._id}

                                                                    ListFooterComponent={() => (<View style={{height:30}}></View>)}

                                                                    disableVirtualization={false}

                                                                />
                                                            :
                                                                <></>
                                            }

                                        </View>

                                        {this.props.ProductStore.getProducts.length == 0
                                        &&
                                        <View style={{display:'flex', height:Dimensions.get('window').height-160, justifyContent:'center', alignItems:'center'}}>
                                            <Image source={EmptyIMG2} style={{width:80, height:80}}/>
                                            <Text style={{fontFamily:'Muli-ExtraBold', marginTop: 15, fontSize:20, color:'#304555'}}>Üzgünüz, ürün yok</Text>
                                            <Text style={{fontFamily:'Muli-SemiBold', marginTop:5, fontSize:15, color:'#304555'}}>bu kategoride henüz ürün yok</Text>
                                        </View>
                                        }

                                    </View>
                            :
                            <View style={[styles.loadingView, {height: this.state.loadingHeight}]}>
                                <Loading />
                            </View>
                        }
                    </View>
                </View>
            </SafeAreaView>
        );
  }
}

const styles = StyleSheet.create({
    selectedTag:{
        borderColor:'#1BD4FE',
        borderWidth:1,
        backgroundColor:'#fff',
        paddingHorizontal:11,
    },
    tag:{
        backgroundColor:'#1BD4FE',
        shadowColor: "#304555",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 1,
        marginRight:13,
        paddingHorizontal:15,
        height:33,
        borderRadius:8,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    cardArea2:{
        display:'flex',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        flexWrap:'wrap',
        paddingTop: 25
    },
    infoSearchText:{
        fontFamily:'Muli-Bold',
        color:'#00CFFF'
    },
    infoTexts:{
        fontFamily:'Muli-ExtraBold',
        fontSize:20,
        color:'#003DFF'
    },
    searchInfoArea:{
        display:'flex',
        flexDirection:'row',
        // justifyContent:'center'
    },
    searchResultArea:{
        display:'flex',
    },
    basketActionArea:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        width:30,
        height:30,
        position:'absolute',
        bottom:5,
        right:5,
        backgroundColor:"#fff",
        borderRadius:50,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.30,
        shadowRadius: 5,
        elevation: 2,
    },
    allCountText:{
      paddingTop: 5,
        fontFamily:'Muli-Light',
        color:'#304555',
        fontSize:7,
        textAlign:'center',
        width:87
    },
    basketText:{
        fontFamily:'Muli-ExtraBold',
        color:'#fff',
        fontSize:13
    },
    basketInfoArea:{
      display:'flex',
        flexDirection:'column',
        alignItems:'flex-end',
        position:'absolute',
        right:10,
        top:70,
        zIndex:9999
    },
    basketInfoBox:{
        width:87,
        height:28,
        backgroundColor:'#003DFF',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,

    },
    discountText:{
        color:'#003DFF',
        fontFamily:'Muli-ExtraBold',
        fontSize:10,
        textAlign:'center'
    },
    discountPercentage:{
        width:30,
        height:30,
        backgroundColor:'#fff',
        borderRadius:50,
        position:'absolute',
        top:5,
        right:5,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.30,
        shadowRadius: 5,
        elevation: 2,
    },
    addToBasketArea:{
      height:35,
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
        width:39,
    },
    cardAboutDiscountOldPrice:{
        fontFamily:'Muli-Bold',
        color:'#A5A5A5',
        fontSize:8,
        marginRight:5,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#A5A5A5",
    },
    infoAboutPricing:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    cardAboutPricing:{
      fontFamily:'Muli-ExtraBold',
        fontSize:11,
        color:'#003DFF',
        display:'flex',
        flexDirection:'column',
    },
    infoAboutName:{

    },
    cardProductName:{
        fontFamily: 'Muli-Bold',
        color:'#304555',
        fontSize: 11
    },

    cardTextAreaInfoArea:{
      width:'100%',
        height:54,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
       // borderRightWidth:1,
       // borderRightColor:'#003DFF',
        paddingVertical:4,
        paddingHorizontal:12
    },
    cardTextArea:{
        width:162,
        display:'flex',
        flexDirection:'row',
        position:'absolute',
        backgroundColor:'#fff',
        height:55,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        opacity:.89,
        bottom:-54,
    },
    cardText:{
        fontFamily:'Muli-ExtraBold',
        color:'#304555',
        fontSize:11
    },
    loadingView:{
        display:'flex',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    content:{
        display:'flex',
        flex:1,
    },
    container:{
        backgroundColor:'#F6F6F6',
        flex:1,
        display:'flex'
    },
    cardArea:{
        display:'flex',
       // flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
       // flexWrap:'wrap',
     //   paddingTop: 50
    },
    card:{
        width:162,
        marginBottom:80,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.10,
        shadowRadius: 5,
        elevation: 1,
    },
    cardWhiteArea:{
        backgroundColor: '#fff',
        borderRadius:20,
        width:162,
        height:105,
        display:'flex',
        justifyContent:'center',
        alignItems: 'center'
    },
    cardImage:{
        width:162,
        height:105,
        borderTopLeftRadius:20,
        borderTopRightRadius:20
    },

});
