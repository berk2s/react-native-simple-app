import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard,
    BackHandler,
    Platform,
} from 'react-native';
import CustomIcon from '../../font/CustomIcon';

import Ripple from 'react-native-material-ripple';

import NavigationService from '../../NavigationService';

//import {useSafeArea} from 'react-native-safe-area-context';

import SafeAreaView from 'react-native-safe-area-view';

export default class BottomTab extends Component {



    state = {
        isSwitcherClicked:false,
        whichSwitch:0
    }

    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
      //  const insets = useSafeArea;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    handleBackButtonPressAndroid = () => {
        if(this.state.whichSwitch == 1){
            this.setState({
                whichSwitch:0,
            });
            //return true;
            this.props.navigation.goBack(null)
        }else{
            this.props.navigation.goBack(null)
        }
        return true;
    };

    _handleSwitcherClick = () => {
        if(this.state.whichSwitch == 0){
            this.setState({
                whichSwitch:1,
            });
            NavigationService.navigate('Currier')
        }else{
            this.setState({
                whichSwitch:0,
            });
            NavigationService.navigate('Category')
        }
    }


    render() {
        const styled = {maxHeight:55}
        const { navigation, renderIcon, activeTintColor, inactiveTintColor } = this.props;
        const { routes } = navigation.state;

            return (
                <View style={[Platform.OS === 'android' && styled ]}>
<SafeAreaView style={[styles.parentTab]}>
                <View style={styles.tab}>

                    <View style={styles.tabArea}>
                        {routes && routes.map((route, index) => {
                            let focused = index === navigation.state.index;
                            let tintColor = focused ? activeTintColor : inactiveTintColor;
                            let tintColorx = focused ? activeTintColor : inactiveTintColor;
                            if(route.key == 'Feed'){
                                return <TouchableWithoutFeedback
                                    key={route.key}
                                    onPress={() => {
                                        this.setState({isSwitcherClicked:false,});
                                        if(!focused){
                                            navigation.navigate(route)
                                        }
                                    }}
                                >
                                    <View  style={styles.bottomPress}>
                                        <CustomIcon   name="home-fill" size={25} style={{color: tintColor}} />
                                    </View>
                                </TouchableWithoutFeedback>
                            }else if(route.key == 'Campaign'){
                                return <TouchableWithoutFeedback
                                    key={route.key}
                                    onPress={() => {
                                        this.setState({isSwitcherClicked:false,});
                                        if(!focused){
                                            navigation.navigate(route)
                                        }
                                    }}
                                >
                                    <View style={styles.bottomPress}>
                                        <CustomIcon  name="star-fill" size={25} style={{color: tintColor}} />
                                    </View>
                                </TouchableWithoutFeedback>
                            }else if(route.key == 'ShopingCard'){
                                return <TouchableWithoutFeedback
                                    key={route.key}
                                    onPress={() => {
                                        this.setState({isSwitcherClicked:false,});
                                        if(!focused){
                                            navigation.navigate(route)
                                        }
                                    }}
                                >
                                    <View style={styles.bottomPress}>
                                        <CustomIcon  name="shopping-cart-fill" size={25} style={{color: tintColor}} />
                                    </View>
                                </TouchableWithoutFeedback>
                            }else if(route.key == 'Profile'){
                                return <TouchableWithoutFeedback

                                    key={route.key}
                                    onPress={() => {
                                        this.setState({isSwitcherClicked:false,});
                                        if(!focused){
                                            navigation.navigate(route)
                                        }
                                    }}
                                >
                                    <View style={styles.bottomPress}>
                                        <CustomIcon style={{height:55, width:100}}  name="person-fill" size={25} style={{color: tintColor}} />
                                    </View>
                                </TouchableWithoutFeedback>
                            }else{
                                return <TouchableWithoutFeedback
                                    key={route.key}
                                    onPress={() => {
                                        this.setState({isSwitcherClicked:!this.state.isSwitcherClicked,});
                                        this.props.jumpTo(this.props.navigation.state.routeKeyHistory[this.props.navigation.state.routeKeyHistory.length-1])}
                                    }
                                >
                                    <View style={styles.bottomPress}>
                                        <CustomIcon   name="us" size={38} style={{color: this.state.isSwitcherClicked ? activeTintColor : inactiveTintColor}} />
                                    </View>
                                </TouchableWithoutFeedback>
                            }
                        })}

                    </View>



                </View>
        </SafeAreaView>

        {this.state.isSwitcherClicked == true
            ? this.state.whichSwitch == 0
                ?
                <View style={{position:'absolute', left:'50%', right:'50%', display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    <View style={styles.box}>
                        <Text style={styles.activeText}><Text style={{color:'#003DFF'}}>maviden</Text><Text style={{color:'#00CFFF'}}>iste</Text></Text>
                    </View>
                    <Ripple rippleCentered={true} rippleContainerBorderRadius={20} style={styles.box} onPress={this._handleSwitcherClick}>
                        <Text style={styles.text}>mavikurye</Text>
                    </Ripple>
                </View>
                :
                <View style={{position:'absolute', left:'50%', right:'50%', display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    <Ripple rippleCentered={true} rippleContainerBorderRadius={20} style={styles.box} onPress={this._handleSwitcherClick}>
                        <Text style={styles.text}>mavideniste</Text>
                    </Ripple>
                    <View style={styles.box}>
                        <Text style={styles.activeText}><Text style={{color:'#003DFF'}}>mavi</Text><Text style={{color:'#00CFFF'}}>kurye</Text></Text>
                    </View>
                </View>
            : <></>
        }
        </View>


            );
    }
}

const styles = StyleSheet.create({
    text:{
        color:'#BCBCBC',
        fontFamily:'Muli-ExtraBold',
        fontSize:15,
      //  marginLeft:1,
        height:20
    },
    box:{
        width:117,
        height:31,
        display:'flex',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#fff',
        borderRadius:20,
        marginHorizontal:5,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        top:-45,
       // zIndex:9999
    },
    activeText:{
        color:'#003DFF',
        fontFamily:'Muli-ExtraBold',
        fontSize:15,
    },
    container2:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'transparent'
    },
    container:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
    },
    topContainer:{
      //  bottom:95,

      //  zIndex:9999,

     //   display:'flex',
      //  bottom:100,
      //  height:100,

      //  position:'absolute',
       // right:'50%',
       // left:'50%'
    },




    bottomPress:{
        display:'flex',
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'center',
        height:55,
    },
    tabArea:{
        width:'100%',

        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-around',
        maxHeight:55,

        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor: 'white',
        elevation:5,
    },
    tab:{
        maxHeight:55,

        position:'relative',

        borderTopColor: 'transparent',

    },
    parentTab:{
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        height:55,
        shadowColor: '#000',
        shadowOpacity:0.15,
        shadowRadius: 10,
        shadowOffset: {
            height: 1,
        },
        elevation:5,
        backgroundColor: '#fff',

    }
});
